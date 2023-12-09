import axios from 'axios';
import React, { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';

const PetListingForm = forwardRef((props, ref) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        console.log(data);
        let queryString = 'http://127.0.0.1:8000/petListing/';
      
        const requestData = {
            name: data.email,
            breed: data.breed,
            age: data.age,
            size: data.size,
            color: data.color,
            gender: data.gender,
            description: data.name,
            shelter: 1,
            date_posted: Date.now(),
            characteristics: data.characteristics,
            avatar: data.avatar
        };
      
        try {
            const accessToken = getAccessToken();
            const resp = await axios.post(queryString, requestData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`
                },
            });
            // Handle response
        } catch (error) {
            {
                console.error('Error creating pet listing:', error);
            }
        }
      };
      

    // Expose the submit function to parent via `ref`
    useImperativeHandle(ref, () => ({
        submitForm: () => handleSubmit(onSubmit)()
    }));

    const formStyle = {
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '20px',
    };

    const labelStyle = {
        fontSize: '1.2em', // Increase the font size of the label
        marginBottom: '5px', // Spacing between the label and input field
    };

    const inputStyle = {
        padding: '10px', // Padding inside the input box
        border: '2px solid #ccc', // Distinct border for input boxes
        borderRadius: '4px', // Rounded corners for input boxes
    };

    const groupStyle = {
        display: 'flex',
        flexDirection: 'column',
    }

    const redText = {
        color: "#de1818"
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)} style={formStyle}>
            <div style={groupStyle}>
                <label htmlFor="name" style={labelStyle}>Pet Name</label>
                <input id="name" style={inputStyle} {...register('name', { required: true })} />
                {errors.name && <span style={redText}>This field is required</span>}
            </div>

            <div style={groupStyle}>
                <label htmlFor="breed" style={labelStyle}>Breed</label>
                <input id="breed" style={inputStyle}{...register('breed', { required: true })} />
                {errors.breed && <span style={redText}> This field is required</span>}
            </div>

            <div style={groupStyle}>
                <label htmlFor="age" style={labelStyle}>Age</label>
                <input id="age" type="number" style={inputStyle}{...register('age', { required: true })} />
                {errors.age && <span style={redText}>This field is required</span>}
            </div>

            <div style={groupStyle}>
                <label htmlFor="size" style={labelStyle}>Size</label>
                <select id="size" style={inputStyle}{...register('size', { required: true })}>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="extra_large">Extra Large</option>
                </select>
                {errors.size && <span style={redText}>This field is required</span>}
            </div>

            <div style={groupStyle}>
                <label htmlFor="color" style={labelStyle}>Color</label>
                <input id="color" style={inputStyle}{...register('color', { required: true })} />
                {errors.color && <span style={redText}>This field is required</span>}
            </div>

            <div style={groupStyle}>
                <label htmlFor="gender" style={labelStyle}>Gender</label>
                <select id="gender" style={inputStyle}{...register('gender', { required: true })}>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                </select>
                {errors.gender && <span style={redText}>This field is required</span>}
            </div>

            <div style={groupStyle}>
                <label htmlFor="description" style={labelStyle}>Description</label>
                <textarea id="description" style={inputStyle}{...register('description', { required: true })} />
                {errors.description && <span style={redText}>This field is required</span>}
            </div>

            <div style={groupStyle}>
                <label htmlFor="characteristics" style={labelStyle}>Characteristics</label>
                <input id="characteristics" style={inputStyle}{...register('characteristics', { required: true })} />
                {errors.characteristics && <span style={redText}>This field is required</span>}
            </div>

            <div style={groupStyle}>
                <label htmlFor="avatar" style={labelStyle}>Avatar</label>
                <input id="avatar" type="file" style={inputStyle}{...register('avatar')} />
            </div>

        </form>
    );
});


export default PetListingForm;
