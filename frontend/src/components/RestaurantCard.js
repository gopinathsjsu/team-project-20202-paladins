import React from "react";
import { Card, CardContent, Typography, Button, Box, Rating, Stack, CardActionArea } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';

const RestaurantCard = ({ 
  restaurant, 
  userRole,
  approveRestaurant,
  deleteRestaurant,
  onEdit,
  tableSlots,
  noOfTimesBookedToday,
  date,
  partySize,
  isAdmin,
  onGenericDeleteClick,
  onCardClick
}) => {

  const navigate = useNavigate();

  const getEndTime = (startTime) => {
    const [hours, minutes, seconds] = startTime.split(":").map(Number);
    const dateInstance = new Date();
    dateInstance.setHours(hours);
    dateInstance.setMinutes(minutes + 60);
    dateInstance.setSeconds(seconds || 0);
    return dateInstance.toTimeString().split(" ")[0];
  };

  const handleCardAreaClick = () => {
    if (onCardClick) {
      onCardClick();
    } else if (restaurant && restaurant.id) {
      navigate(`/restaurants/${restaurant.id}`);
    }
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        boxShadow: 3,
        height: "100%",
        overflow: "hidden",
        "&:hover": {
          boxShadow: 10,
          transform: "scale(1.02)",
          transition: "all 0.3s ease-in-out",
        },
      }}
    >
      <CardActionArea
        onClick={handleCardAreaClick}
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          textDecoration: "none",
          color: "inherit",
          cursor: 'pointer',
        }}
      >
        <Box
          sx={{
            height: "250px",
            width: "100%",
            overflow: "hidden",
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
            position: "relative",
          }}
        >
          <img
            src={restaurant.imageUrl || "https://placekitten.com/586/788"}
            alt={restaurant.name}
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              position: "absolute",
              top: "0",
              left: "0",
            }}
          />
        </Box>

        <CardContent sx={{ padding: 2, flexGrow: 1 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 1 }}>
            {restaurant.name}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <Rating value={restaurant.averageRating} precision={0.1} readOnly size="small" />
            <Typography variant="body2" color="text.secondary">
              ({restaurant.reviewCount} reviews)
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Cost: {restaurant.cost || "$$"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Booked Today: {noOfTimesBookedToday || 0} times
          </Typography>
        </CardContent>
      </CardActionArea>

      <Box sx={{ padding: "16px", display: "flex", flexDirection: 'column', justifyContent: "center", gap: 1 }}>
        {isAdmin && (
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={(e) => {
              e.stopPropagation();
              if (onGenericDeleteClick) onGenericDeleteClick();
            }}
            sx={{ borderRadius: "30px", width: "100%", fontSize: "14px", mb: (userRole !== "ADMIN" || (typeof restaurant.approved !== 'boolean' || restaurant.approved)) ? 0 : 1 }}
          >
            Delete Restaurant
          </Button>
        )}

        {!isAdmin && userRole === "ADMIN" && typeof restaurant.approved === 'boolean' && !restaurant.approved && (
          <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
            <Button
              variant="contained"
              color="primary"
              onClick={approveRestaurant}
              sx={{ borderRadius: "30px", width: "48%", fontSize: "14px", "&:hover": { backgroundColor: "#2DD4BF" } }}
            >
              Approve
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={deleteRestaurant}
              sx={{ borderRadius: "30px", width: "48%", fontSize: "14px", "&:hover": { borderColor: "#F44336", backgroundColor: "#F44336", color: "white" } }}
            >
              Reject
            </Button>
          </Box>
        )}

        {!isAdmin && userRole === "RESTAURANT_MANAGER" && (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => onEdit(restaurant)}
            sx={{ width: "100%" }}
          >
            Edit Restaurant
          </Button>
        )}

        {!isAdmin && userRole !== "ADMIN" && userRole !== "RESTAURANT_MANAGER" && (
          <>
            {tableSlots && tableSlots.length <= 0 ? (
              <Button
                variant="outlined"
                fullWidth
                disabled
                sx={{ borderRadius: "30px" }}
              >
                No tables available
              </Button>
            ) : tableSlots && tableSlots.length > 0 ? (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'center' }}>
                  Available Time Slots:
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                  }}
                >
                  {tableSlots.slice(0, 6).map((slotInfo) =>
                    slotInfo.slot.map((startTime, i) => {
                      const endTime = slotInfo.slot[i + 1] || getEndTime(startTime);
                      return (
                        <Link
                          key={`${slotInfo.tableId}-${startTime}`}
                          to={`/booking/${restaurant.id}`}
                          state={{
                            selectedSlot: { restaurantId: restaurant.id, tableId: slotInfo.tableId, startSlotTime: startTime, endSlotTime: endTime, date: date },
                            restaurantDetails: { id: restaurant.id, name: restaurant.name, addressStreet: restaurant.addressStreet, addressCity: restaurant.addressCity },
                            partySize: partySize
                          }}
                          style={{ textDecoration: "none" }}
                        >
                          <Button size="small" variant="outlined" sx={{ borderRadius: "20px", textTransform: "none", width: "100%" }}>
                            {startTime}
                          </Button>
                        </Link>
                      );
                    })
                  )}
                </Box>
              </Box>
            ) : (
              <Link to={`/booking/${restaurant.id}`} style={{ width: "100%", textDecoration: 'none' }}>
                <Button variant="contained" fullWidth color="primary" sx={{ borderRadius: "30px" }}>
                  Book a Table
                </Button>
              </Link>
            )}
          </>
        )}
      </Box>
    </Card>
  );
};

export default RestaurantCard;
