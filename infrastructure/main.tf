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

# EC2 instances
resource "aws_instance" "backend" {
  ami           = "ami-04fc83311a8d478df"  # Amazon Linux AMI
  instance_type = "t2.micro"
  count         = 2

  security_groups = [aws_security_group.web_sg.name]

  tags = {
    Name = "BookTableEC2"
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
}

output "ec2_ips" {
  value = aws_instance.backend[*].public_ip
}
