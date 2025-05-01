import React from "react";
import { Card, CardContent, CardMedia, Typography, Stack, Chip, Rating, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

const RestaurantCard = ({ restaurant, userRole, onTimeSlotClick }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3, borderRadius: 2 }}>
      <CardMedia
        component="img"
        height="200"
        image={restaurant.imageUrl}
        alt={restaurant.name}
        sx={{ objectFit: 'cover', borderTopLeftRadius: 2, borderTopRightRadius: 2 }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={2}>
          {/* Restaurant Info */}
          <Box>
            <Typography variant="h6" component="h2" gutterBottom>
              {restaurant.name}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              {restaurant.cuisines?.map((cuisine, index) => (
                <Chip key={index} label={cuisine} size="small" sx={{ bgcolor: "#E0F7FA" }} />
              ))}
              <Typography variant="body2" color="text.secondary">
                {restaurant.averageRating} ({restaurant.reviewCount} reviews)
              </Typography>
            </Stack>
          </Box>

          {/* Ratings and Bookings */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Rating value={restaurant.averageRating} precision={0.1} readOnly size="small" />
              <Typography variant="body2" color="text.secondary">
                ({restaurant.reviewCount} reviews)
              </Typography>
            </Stack>
          </Stack>

          {/* Available Time Slots */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Available Times:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {restaurant.availableTimes?.slice(0, 4).map((time, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  size="small"
                  onClick={() => onTimeSlotClick(restaurant.id, time)}
                  sx={{
                    mt: 1,
                    color: '#2DD4BF',
                    borderColor: '#2DD4BF',
                    '&:hover': {
                      bgcolor: '#2DD4BF',
                      color: 'white',
                      borderColor: '#2DD4BF'
                    }
                  }}
                >
                  {time}
                </Button>
              ))}
            </Stack>
          </Box>

          {/* Conditional Actions Based on User Role */}
          {userRole === "CUSTOMER" && (
            <Button variant="contained" fullWidth sx={{ mt: 2 }}>
              Book Now
            </Button>
          )}

          {userRole === "RESTAURANT_MANAGER" && (
            <Link to={`/manager/edit/${restaurant.id}`}>
              <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                Edit Restaurant
              </Button>
            </Link>
          )}

          {userRole === "ADMIN" && (
            <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
              Approve Restaurant
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
