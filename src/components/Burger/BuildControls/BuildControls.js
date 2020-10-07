import React from 'react';
import classes from './BuildControls.module.css';
import BuildControl from './BuildControl/BuildControl';
const controls=[
    { label:'Bacon', type:'bacon'},
    { label:'Cheese', type:'cheese'},
    { label:'Meat', type:'meat'},
    { label:'Salad', type:'salad'}
];

const buildControls = (props) => {

    return(
        <div className={classes.BuildControls}>
            <p>Price: <strong>{props.price.toFixed(2)}</strong></p>
            {controls.map(ctrl =>(
                <BuildControl 
                key={ctrl.label} 
                label={ctrl.label}
                added={()=> props.ingredientAdded(ctrl.type)}
                deleted={()=> props.ingredientDeleted(ctrl.type)}
                disabled={props.disabled[ctrl.type]}/>
            ))}
            <button 
            className={classes.OrderButton} 
            disabled={!props.purchasable}
            onClick={props.ordered}>ORDER NOW</button>
            
        </div>
    );
};

export default buildControls;
