import React, { useEffectEvent, useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFirebase } from "../context/Firebase";
import { Button } from "react-bootstrap";
import Form from 'react-bootstrap/Form';

const BookDetailPage = ()=>{

    const params = useParams();
    const firebase = useFirebase();
     
    const [url,setURL] = useState(null);

    const [data,setData] = useState(null);

    const [qty,setQty] = useState(1);

    const placeOrder = async ()=>{
        const result = await firebase.placeOrder(params.bookId,qty)
        console.log("Order Placed");
    }

    useEffect(()=>{
        firebase.getBookById(params.bookId).then(value=>setData(value.data()))
    },[])

    useEffect(()=>{
        if(data){
            const imageURL = data.imageURL;
            setURL(imageURL);
        }
    },[data])

    if(data==null) return <h1>Loading...</h1>

    return(
        <div className="container">
            <h1>{data.name}</h1>
            <img src={url} width='50%'/>
            <h1>Details</h1>
            <p>Price: Rs.{data.price}</p>
            <p>ISBN Number. {data.isbn}</p>
            <h1>Owner Details</h1>
            <p>Name: {data.displayName}</p>
            <p>Email: {data.userEmail}</p>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Quantity</Form.Label>
                <Form.Control onChange={(e)=>setQty(e.target.value)} value={qty} type="Number" placeholder="Specify Quantity" />
            </Form.Group>
            <Button onClick={placeOrder} variant='success'>Buy Now</Button>
        </div>
    )
}

export default BookDetailPage;