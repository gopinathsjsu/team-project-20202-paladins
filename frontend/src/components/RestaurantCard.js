import React from "react";
import {Box, Button, Card, CardContent, Rating, Stack, Typography} from "@mui/material";
import {Link} from "react-router-dom";

const RestaurantCard = ({
                          restaurant,
                          userRole,
                          approveRestaurant,
                          deleteRestaurant,
                          onEdit,
                          tableSlots,
                          noOfTimesBookedToday,
                          date,
                          partySize
                        }) => {

  const getEndTime = (startTime) => {
    const [hours, minutes, seconds] = startTime.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes + 60);
    date.setSeconds(seconds || 0);
    return date.toTimeString().split(" ")[0];
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
          transform: "scale(1.05)",
          transition: "all 0.3s ease-in-out",
        },
      }}
    >
      {/* Fixed size image container */}
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

      {/* Content Section */}
      <CardContent sx={{padding: 2, flexGrow: 1}}>
        <Typography variant="h6" component="div" sx={{fontWeight: 600, mb: 1}}>
          {restaurant.name}
        </Typography>

        {/* Ratings and Review Count */}
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <Rating value={restaurant.averageRating} precision={0.1} readOnly size="small"/>
          <Typography variant="body2" color="text.secondary">
            ({restaurant.reviewCount} reviews)
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{mt: 1}}>
          Cost: {restaurant.cost || "$$"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Booked Today: {noOfTimesBookedToday || 0} times
        </Typography>
      </CardContent>

      {/* Dynamic Button Section */}
      <Box sx={{padding: "16px", display: "flex", justifyContent: "center", gap: 1}}>
        {userRole === "ADMIN" && !restaurant.approved ? (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={approveRestaurant}
              sx={{
                borderRadius: "30px",
                width: "48%",
                fontSize: "14px",
                "&:hover": {
                  backgroundColor: "#2DD4BF",
                },
              }}
            >
              Approve
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={deleteRestaurant}
              sx={{
                borderRadius: "30px",
                width: "48%",
                fontSize: "14px",
                "&:hover": {
                  borderColor: "#F44336",
                  backgroundColor: "#F44336",
                  color: "white",
                },
              }}
            >
              Reject
            </Button>
          </>
        ) : userRole === "RESTAURANT_MANAGER" ? (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => onEdit(restaurant)}
            sx={{width: "100%"}}
          >
            Edit Restaurant
          </Button>
        ) : tableSlots && tableSlots.length <= 0 ? (
          <Button
            variant="outlined"
            fullWidth
            disabled // Disable the button
            sx={{borderRadius: "30px"}}
          >
            No tables available
          </Button>
        ) : tableSlots && tableSlots.length > 0 ? (
          <Box>
            <Typography variant="subtitle2" sx={{mb: 1}}>
              Available Time Slots:
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
              }}
            >
              {tableSlots.map((slotInfo) =>
                slotInfo.slot.map((startTime, i) => {
                  const endTime = slotInfo.slot[i + 1] || getEndTime(startTime);
                  // const slotData = {
                  //   tableId: slotInfo.tableId,
                  //   startSlotTime: startTime,
                  //   endSlotTime: endTime,
                  //   date: new Date().toISOString().split('T')[0],
                  // };
                  return (
                    <Link
                      key={`${slotInfo.tableId}-${startTime}`}
                      to={`/booking/${restaurant.id}`}
                      state={{
                        selectedSlot: {
                          restaurantId: restaurant.id,
                          tableId: slotInfo.tableId,
                          startSlotTime: startTime,
                          endSlotTime: endTime,
                          date: date,
                        },
                        restaurantDetails: {
                          id: restaurant.id,
                          name: restaurant.name,
                          addressStreet: restaurant.addressStreet,
                          addressCity: restaurant.addressCity,
                        },
                        partySize: partySize
                      }}
                      style={{textDecoration: "none"}}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          borderRadius: "20px",
                          textTransform: "none",
                          width: "100%",
                        }}
                      >
                        {startTime}
                      </Button>
                    </Link>
                  );
                })
              )}
            </Box>
          </Box>
        ) : (
          <Link to={`/booking/${restaurant.id}`} style={{width: "100%"}}>
            <Button variant="contained" fullWidth color="primary" sx={{borderRadius: "30px"}}>
              Book a Table
            </Button>
          </Link>
        )}
      </Box>
    </Card>
  );
};

export default RestaurantCard;
