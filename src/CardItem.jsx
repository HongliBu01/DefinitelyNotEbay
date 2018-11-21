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
        this.getItem = this.getItem.bind(this)
        this.removeFromWatchlist = this.removeFromWatchlist.bind(this)
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
            if (moment(Date.now()).isAfter(moment(this.state.endTime))) {
              this.setState({remainingTime: "Expired"})
            } else {
              const duration = moment.duration(moment(this.state.endTime).diff(moment(Date.now())))
              this.setState({remainingTime: duration.humanize()})
            }
        })
    }

    removeFromWatchlist() {
        console.log("triggering remove from watchlist")
        //TODO: implement this.removeFromWatchlist(), probably import from Item Page?
    }

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
                    <Typography color="textSecondary">
                        Time Remaining: {this.state.remainingTime}
                    </Typography>
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
                <CardActions>
                    <Button onClick={()=>this.removeFromWatchlist()} size="small">Remove From Watchlist</Button>
                </CardActions>
            </Card>
        );
    }

}

export default withStyles(styles)(CardItem);
