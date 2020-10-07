import React from 'react';
import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredients/BurgerIngredients';

const burger = (props) => {

    let transfromedIngredients = Object.keys(props.ingredients)
        .map(igKey => {
            //console.log(props.ingredients); This gives the key pair object
            //console.log(igKey); This gives each key of the object 
            //console.log(props.ingredients[igKey]); This gives value of that particular key
            return [...Array(props.ingredients[igKey])].map((_,i) => {
                //this loop runs for (value=i)th time for the particular key
                return <BurgerIngredient key={igKey + i} type={igKey} />;
            });
            
        }).reduce((arr,el)=>{
            return arr.concat(el);
        },[]);
        if(transfromedIngredients.length ===0 ){
            transfromedIngredients=<p>Start adding ingredients!</p>
        }
        

    return(
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transfromedIngredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    );

};

export default burger;