import React , {use, useEffect, useState} from "react";

import axios from 'axios'

const Contacts=()=>{
  const [contacts, setContacts]=useState([]);
  const [formData, setFormData]=useState({name:'', email:'', phone:'' , message:''});
  const [editId,setEditId]=useState(null);
  const [error, setError]=useState('');



  useEffect(()=>{
     const fetchContacts=async()=>{
    try {
        const response= await axios.get('http://localhost:5000/contacts');
        setContacts(response.data);
    } catch (error) {
        setError('Failed');
    }
   };
   fetchContacts();
} , []);


//handle form input changes
const handleChange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value});
};

   const deleteContact=async(id)=>{
   try {
    await axios.delete(`http://localhost:5000/contacts/${id}`);
    setContacts(contacts.filter((contact)=>contact._id!== id));
    setError('');
   } catch (error) {
    setError('Error to delete');
   }  
};


//create or update
const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
         if(editId){
            const response= await axios.put(`http://localhost:5000/contacts/${editId}`,formData);
            setContacts(contacts.map((contact)=>(contact._id===editId ? response.data.data : contact)));
            setEditId(null);
         }
         else{
            //create contact
        const response= await axios.post('http://localhost:5000/contacts',formData);
        setContacts([...contacts,response.data.data]);
        }
        setFormData({name:'', email:'', phone:'' , message:''});
        setError('');

        const response= await axios.get('http://localhost:5000/contacts');
        setContacts(response.data);

    } catch (error) {
        setError(editId ? 'Failed to edit': 'Failed to Add');
    }
};

const handleEdit=(contact)=>{
    setFormData({name:contact.name , email:contact.email, phone:contact.phone , message:contact.message});
    setEditId(contact._id);
};


    return(
        <div>
            <h1>Contacts Management</h1>
            <div>Add Contact</div>
            {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} className="form">
            <div>
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </div>
             <div>
                <label>Email:</label>
                <input type="text" name="email" value={formData.email} onChange={handleChange} />
            </div>
             <div>
                <label>Phone:</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
             <div>
                <label>Message:</label>
                <input type="text" name="message" value={formData.message} onChange={handleChange} />
            </div>
         <button type="submit">{editId ? 'Update Contact' : 'Add Contact'}</button>
        </form>

           <h3>Contact List</h3>
           {contacts.length===0 ? (
            <p>No contacts found</p>):(
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((contact) => (
                            <tr key={contact._id}>
                                <td>{contact.name}</td>
                                <td>{contact.email}</td>
                                <td>{contact.phone}</td>
                                <td>{contact.message}</td>
                                <td>
                                    <button onClick={handleEdit(contact)} >Edit</button>
                                    <button onClick={()=> deleteContact(contact._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
           )}
        </div>
    );
};

export default Contacts;