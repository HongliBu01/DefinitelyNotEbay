import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom'

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
            startPrice: ""
        };
        this.getItem = this.getItem.bind(this)
    }

    componentWillMount() {
        this.getItem();
    }

    getItem() {
        const itemID = this.props.itemID;
        console.log("ID IS", itemID)
        this.setState({itemID: itemID})
        fetch(`/api/items/${itemID}`)
            .then(results => {
                return results.json()
            }).then(data => {
            console.log(data);
            this.setState({...data})
        })
    }

    render() {
        return (
            <Card>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        Item Details
                    </Typography>
                    <Typography variant="h5" component="h2">
                        {this.state.name || "Not Specified"}
                    </Typography>
                    <Typography color="textSecondary">
                        Quantity: {this.state.quantity || "Not Specified"}
                    </Typography>
                    <Typography color="textSecondary">
                        Time: {this.state.startTime || "Not Specified"} - {this.state.endTime || "Not Specified"}
                    </Typography>
                    <Typography component="p">
                        Bid Price: {this.state.startPrice || "Not Specified"}
                    </Typography>
                    <Typography color="textSecondary">
                        Description:
                        {this.state.description || "Not Specified"}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Link to={`/item/${this.state.itemID }`|| 'Null'}><Button size="small">Learn More</Button></Link>
                </CardActions>
            </Card>
        );
    }

}

export default withStyles(styles)(CardItem);