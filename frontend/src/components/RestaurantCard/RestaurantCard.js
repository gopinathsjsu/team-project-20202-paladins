// src/components/RestaurantCard/RestaurantCard.js
import React, { useMemo } from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Chip,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Renders a single restaurant card.
 * Works with either a plain `restaurant` object
 * or the “search-hit” wrapper { restaurant, tableSlots }.
 */
const RestaurantCard = ({ restaurant: r, tableSlots = [] }) => {
    const theme = useTheme();

    /* ── unwrap when the parent passed { restaurant, tableSlots } ── */
    const restaurant = r?.restaurant ?? r;

    const {
        name,
        cuisines = [],
        imageUrl,
    } = restaurant;

    /* ── first two unique time slots across all tables ── */
    const upcomingTimes = useMemo(
        () => [...new Set(tableSlots.flatMap(t => t.slot))].slice(0, 2),
        [tableSlots]
    );

    /* ── fallback in case imageUrl is missing ── */
    const placeholder = '/images/restaurant-placeholder.jpg';

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: theme.shadows[8] },
            }}
            elevation={1}
        >
            <CardMedia
                component="img"
                height="200"
                image={imageUrl || placeholder}
                alt={`${name} hero photo`}
                sx={{ objectFit: 'cover' }}
            />

            <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                    gutterBottom
                    variant="h5"
                    sx={{ fontFamily: 'Poppins, sans-serif' }}
                >
                    {name}
                </Typography>

                {cuisines.length > 0 && (
                    <Chip
                        label={cuisines[0]}
                        size="small"
                        sx={{ mb: 1, fontFamily: 'Poppins, sans-serif' }}
                    />
                )}

                {upcomingTimes.length > 0 && (
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        {upcomingTimes.map(t => (
                            <Chip
                                key={t}
                                size="small"
                                label={t}
                                variant="outlined"
                                aria-label={`Next available at ${t}`}
                                sx={{ fontFamily: 'Poppins, sans-serif' }}
                            />
                        ))}
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
};

RestaurantCard.propTypes = {
    /* Either a flat restaurant object or a search-hit wrapper */
    restaurant: PropTypes.oneOfType([
        PropTypes.shape({
            id:       PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            _id:      PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name:     PropTypes.string.isRequired,
            imageUrl: PropTypes.string,
            cuisines: PropTypes.arrayOf(PropTypes.string),
        }),
        PropTypes.shape({
            restaurant: PropTypes.object.isRequired,
        }),
    ]).isRequired,
    tableSlots: PropTypes.arrayOf(
        PropTypes.shape({
            tableId: PropTypes.string,
            slot:    PropTypes.arrayOf(PropTypes.string),
        })
    ),
};

export default RestaurantCard;
