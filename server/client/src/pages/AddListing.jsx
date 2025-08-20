import React, { useState } from "react";
import axiosInstance from "../utils/axios";

const AddListing = () => {
    const [form, setForm] = useState({
        name: "",
        location: "",
        province: "",
        country: "",
        rooms: 1,
        price: 0,
        amenities: "",
        description: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post("/places", form);
            alert("Listing added!");
            setForm({
                name: "",
                location: "",
                province: "",
                country: "",
                rooms: 1,
                price: 0,
                amenities: "",
                description: ""
            });
        } catch (err) {
            alert("Error adding listing");
        }
    };

    return (
        <div className="add-listing">
            <h2>Add Listing</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Hotel Name</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Hotel Name" />
                </div>
                <div>
                    <label>Location</label>
                    <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="City, Address" />
                </div>
                <div>
                    <label>Province/State</label>
                    <input type="text" name="province" value={form.province} onChange={handleChange} placeholder="Province/State" />
                </div>
                <div>
                    <label>Country</label>
                    <input type="text" name="country" value={form.country} onChange={handleChange} placeholder="Country" />
                </div>
                <div>
                    <label>Number of Rooms</label>
                    <input type="number" name="rooms" min="1" value={form.rooms} onChange={handleChange} placeholder="Number of Rooms" />
                </div>
                <div>
                    <label>Price per Night</label>
                    <input type="number" name="price" min="0" value={form.price} onChange={handleChange} placeholder="Price per Night" />
                </div>
                <div>
                    <label>Amenities</label>
                    <input type="text" name="amenities" value={form.amenities} onChange={handleChange} placeholder="e.g. Wifi, Pool, Parking" />
                </div>
                <div>
                    <label>Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your property"></textarea>
                </div>
                <button type="submit">Add Listing</button>
            </form>
        </div>
    );
};

export default AddListing;