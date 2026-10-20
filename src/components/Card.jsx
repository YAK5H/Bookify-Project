import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from "react-router-dom";
// import { useFirebase } from "../context/Firebase";

const BookCard = (props)=>{
    // const firebase = useFirebase();
    // const [url,setURL] = useState(null);

    // useEffect(()=>{
    //     firebase.getImageURL(props.imageURL).then((url)=>setURL(url));
    // },[])

    const navigate = useNavigate();

    return(
        <Card style={{ width: '18rem', margin: '25px'}}>
      <Card.Img variant="top" src={props.imageURL} />
      <Card.Body>
        <Card.Title>{props.name}</Card.Title>
        <Card.Text>
          This book has a title {props.name} and this book is sold by {props.displayname} and this book costs Rs.{props.price} 
        </Card.Text>
        <Button onClick={e=> navigate(props.link)} variant="primary">View</Button>
      </Card.Body>
    </Card>
    )
};

export default BookCard;