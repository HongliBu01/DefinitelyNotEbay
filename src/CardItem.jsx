import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom'
import moment from 'moment'
// import Calendar from './iCalendar/Calendar';

const styles = {
    card: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
};


class CardItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            description: "",
            name: "",
            quantity: 1,
            buyPrice: "",
            categories: [],
            endTime: "",
            reportFlag: false,
            shippingPrice: "",
            startTime: "",
            itemID: "",
            startPrice: "",
            remainingTime: ""
        };
        this.getItem = this.getItem.bind(this);
        // TODO: calendar item
        // this.createIcs = this.createIcs.bind(this) Temporarily disabled to prevent problems.
        // removed
        // this.removeFromWatchlist = this.removeFromWatchlist.bind(this)
    }

    componentWillMount() {
        this.getItem();
    }

    getItem() {
        const itemID = this.props.itemID;
        this.setState({itemID: itemID})
        fetch(`/api/items/${itemID}`)
            .then(results => {
                return results.json()
            }).then(data => {
            this.setState({...data})
            this.setState({bidHistory: data.bid_history})
            if (this.state.bidHistory.length > 0) {
              this.setState({startPrice: this.state.bidHistory[this.state.bidHistory.length-1].bidPrice})
            }
            if (moment(Date.now()).isAfter(moment(this.state.endTime))) {
              this.setState({remainingTime: "Expired"})
            } else {
              const duration = moment.duration(moment(this.state.endTime).diff(moment(Date.now())))
              this.setState({remainingTime: duration.humanize()})
            }
        })
    }

    // remove from watchlist is not in item page
    // Creating calendar event:
    // createIcs(item, des, start, end){
    //     Calendar().createIcs(item, des, start, end);
    // }

    render() {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        {this.state.name || "Not Specified"}
                    </Typography>
                    <Typography color="textSecondary">
                        Quantity: {this.state.quantity || "Not Specified"}
                    </Typography>
                    {this.props.showBought && this.state.soldFlag ? <Typography color="textSecondary">
                        SOLD
                    </Typography> :
                    <Typography color="textSecondary">
                        Time Remaining: {this.state.remainingTime}
                    </Typography>}
                    <Typography color="textSecondary">
                        Bid Price: ${this.state.startPrice || "Not Specified"}
                    </Typography>
                    {this.state.buyPrice === "0.00" ? null : <Typography color="textSecondary">
                        Buy Price: ${this.state.buyPrice}
                    </Typography>}
                    <Typography color="textSecondary">
                        Description: {this.state.description || "Not Specified"}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Link to={`/item/${this.state.itemID }`|| null} style={{ textDecoration: 'none' }}><Button size="small">Learn More</Button></Link>
                </CardActions>
                {/*<CardActions>*/}
                    {/*<Button onClick={()=>this.createIcs("new", "newitem", [2018, 5, 30, 6, 30], [2018, 5, 31, 6, 30])} size="small">Add Expiration Reminder</Button>*/}
                {/*</CardActions> this should not be here.*/}
            </Card>
        );
    }

}

export default withStyles(styles)(CardItem);
