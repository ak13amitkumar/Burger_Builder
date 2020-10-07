import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuilControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES ={
    salad: 0.5,
    bacon: 0.7,
    cheese: 0.4,
    meat: 1.3
};

class BurgerBuilder extends Component{

    /*constructor(props){
        super(props);
        this.state ={...}
    }*/

    state={
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount(){
        axios.get('https://react-burger-builder-970f2.firebaseio.com/ingredients.json')
            .then(response=>{
                this.setState({ingredients: response.data});
            })
            .catch(error =>  {
                this.setState({error: true});
            });
    }

    /*purchaseHandler()  {
        this.setState({purchasing: true});
    } */ //This syntax fails, because if we try to use the 'this' keyword 
         //and if the method is triggered through an event due to way 'this' keyword works in JS.

    purchaseHandler =() => {
            this.setState({purchasing: true});
    }

    purchaseCancelHandler =() => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler =() =>{

       
        const queryParams =[];
        for(let i in this.state.ingredients){
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price='+ this.state.totalPrice);
        const queryString= queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?'+ queryString
        });
    }

    updatePurchaseState (ingredients) {
        const sum=Object.keys(ingredients)
        .map(igKey => {
            return ingredients[igKey];
        }).reduce((sum,el)=>{
            return sum+el;
        }, 0);

        this.setState({purchasable: sum>0});
    }

    addIngredientsHandler= (type) => {

        const oldCount=this.state.ingredients[type];
        const updatedCount= oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type]=updatedCount;
        const oldPrice= this.state.totalPrice;
        const newPrice= oldPrice + INGREDIENT_PRICES[type];

        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);

    };

    deleteIngredientsHandler= (type) => {

        const oldCount=this.state.ingredients[type];
        if(oldCount <=0){
            return;
        }
        const updatedCount= oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type]=updatedCount;
        const oldPrice= this.state.totalPrice;
        const newPrice= oldPrice - INGREDIENT_PRICES[type];

        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);

    }

    render(){
        const disabledInfo={
            ...this.state.ingredients
        };
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        //{bacon: true, cheese: false....}
        let orderSummary=null;
        let burger= this.state.error ? <p>Ingredients can't be loaded</p>: <Spinner />;
        if(this.state.ingredients){
            burger= (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuilControls 
                        ingredientAdded={this.addIngredientsHandler}
                        ingredientDeleted={this.deleteIngredientsHandler}
                        disabled={disabledInfo}
                        price={this.state.totalPrice}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}
                     />
                </Aux>
            );
            orderSummary= <OrderSummary 
                              ingredients={this.state.ingredients}
                              purchaseCanceled={this.purchaseCancelHandler}
                              purchaseContinue={this.purchaseContinueHandler}
                              price={this.state.totalPrice}/>;
        }
        if(this.state.loading){
            orderSummary= <Spinner />
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }

}

export default withErrorHandler(BurgerBuilder,axios);