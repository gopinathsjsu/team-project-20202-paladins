provider "aws" {
  region = "us-west-1"
}

# Fetch the default VPC
data "aws_vpc" "default" {
  default = true
}

# Fetch the default subnets
data "aws_subnet" "subnet_b" {
  filter {
    name   = "availabilityZone"
    values = ["us-west-1b"]
  }
  vpc_id = data.aws_vpc.default.id
}

data "aws_subnet" "subnet_c" {
  filter {
    name   = "availabilityZone"
    values = ["us-west-1c"]
  }
  vpc_id = data.aws_vpc.default.id
}

resource "aws_security_group" "web_sg" {
  name        = "web_sg"
  description = "Allow SSH and HTTP traffic"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "WebSecurityGroup"
  }
}

# Create IAM Role for EC2 to allow SSM usage
resource "aws_iam_role" "ec2_ssm_role" {
  name = "EC2SSMRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      },
    ]
  })
}

# Attach the SSM policy to the IAM Role
resource "aws_iam_role_policy_attachment" "ec2_ssm_policy_attachment" {
  role       = aws_iam_role.ec2_ssm_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# Create IAM Instance Profile
resource "aws_iam_instance_profile" "ec2_ssm_profile" {
  name = "EC2SSMProfile"
  role = aws_iam_role.ec2_ssm_role.name
}

# EC2 instances
resource "aws_instance" "backend" {
  ami           = "ami-04fc83311a8d478df"  # Amazon Linux AMI
  instance_type = "t2.micro"
  count         = 2

  security_groups = [aws_security_group.web_sg.name]
  iam_instance_profile = aws_iam_instance_profile.ec2_ssm_profile.name

  tags = {
    Name = "BookTableEC2"
    Environment = "production"
  }
}

# Application Load Balancer
resource "aws_lb" "app_lb" {
  name               = "booktable-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups   = [aws_security_group.web_sg.id]
  subnets            = [data.aws_subnet.subnet_b.id, data.aws_subnet.subnet_c.id]  # Reference subnets in AZs us-west-1b and us-west-1c

  enable_deletion_protection = false

  tags = {
    Name = "BookTableLB"
  }
}

resource "aws_lb_target_group" "app_target_group" {
  name     = "booktable-target-group"
  port     = 80
  protocol = "HTTP"
  vpc_id   = data.aws_vpc.default.id

  health_check {
    protocol = "HTTP"
    path     = "/health"
  }

  tags = {
    Name = "BookTableTargetGroup"
  }
}

resource "aws_lb_listener" "front_end" {
  load_balancer_arn = aws_lb.app_lb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "fixed-response"
    fixed_response {
      status_code = 200
      content_type = "text/plain"
      message_body = "OK"
    }
  }
}

# Launch Template for EC2 instances
resource "aws_launch_template" "app_launch_template" {
  name_prefix   = "booktable-launch-template"
  image_id      = "ami-04fc83311a8d478df" # Amazon Linux AMI
  instance_type = "t2.micro"

  vpc_security_group_ids = [aws_security_group.web_sg.id]

}

# Auto Scaling Group
resource "aws_autoscaling_group" "app_auto_scaling_group" {
  desired_capacity     = 2
  max_size             = 3
  min_size             = 1
  vpc_zone_identifier  = [data.aws_subnet.subnet_b.id, data.aws_subnet.subnet_c.id]  # Reference default subnets in us-west-1b and us-west-1c
  launch_template {
    id      = aws_launch_template.app_launch_template.id
    version = "$Latest"
  }
  tag {
    key                 = "Name"
    value               = "BookTableASG"
    propagate_at_launch = true
  }
  tag {
    key                 = "Environment"
    value               = "production"
    propagate_at_launch = true
  }

}

resource "aws_ssm_document" "install_docker_nginx_run_app" {
  name          = "InstallDockerNginxRunApp"
  document_type = "Command"
  content = jsonencode({
    schemaVersion = "2.2",
    description   = "Install Docker, Nginx, and Run Docker containers from Docker Hub",
    mainSteps = [
      {
        action = "aws:runShellScript"
        name   = "installDockerNginxAndRunApp"
        inputs = {
          runCommand = [
            "sudo yum update -y",
            "echo Installing Docker...",
            "sudo amazon-linux-extras install docker -y",
            "sudo service docker start",
            "echo Installing nginx...",
            "sudo yum install nginx -y",
            "sudo service nginx start",
            "sudo docker pull bhusalashish/booktable-backend:latest",
            "sudo docker pull bhusalashish/booktable-frontend:latest",
            "sudo docker run -d -p 8080:8080 bhusalashish/booktable-backend:latest",
            "sudo docker run -d -p 80:80 bhusalashish/booktable-frontend:latest"
          ]
        }
      }
    ]
  })
}

output "ec2_public_ips" {
  value = aws_instance.backend[*].public_ip
}

output "ec2_private_ips" {
  value = aws_instance.backend[*].private_ip
}

output "load_balancer_dns_name" {
  value = aws_lb.app_lb.dns_name
}

output "security_group_id" {
  value = aws_security_group.web_sg.id
}

output "auto_scaling_group_name" {
  value = aws_autoscaling_group.app_auto_scaling_group.name
}

output "load_balancer_arn" {
  value = aws_lb.app_lb.arn
}