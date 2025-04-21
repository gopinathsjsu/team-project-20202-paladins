import {Tooltip, tooltipClasses} from '@mui/material';
import {styled} from '@mui/material/styles';

const StyledTooltip = styled(({className, ...props}) => (
    <Tooltip arrow placement="bottom" {...props} classes={{popper: className}}/>
))(({theme}) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.background.paper, // softer bg
        color: theme.palette.text.primary,
        fontSize: 13,
        fontWeight: 400,
        borderRadius: 6,
        padding: theme.spacing(1),
        boxShadow: theme.shadows[2],
        border: `1px solid ${theme.palette.divider}`,
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.background.paper,
    },
}));

export default StyledTooltip;
