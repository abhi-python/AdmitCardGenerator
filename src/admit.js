import React, { useState } from 'react';
import axios from 'axios';

function AdmitCardGenerator() {
  const [userDetails, setUserDetails] = useState({
    name: '',
    phone: '',
    school: '',
    classs: '',
    rollNo: '',
    address: ''
  });
  const [admitCardUrl, setAdmitCardUrl] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prevState => ({ ...prevState, [name]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/saveUserDetails', userDetails);
      setAdmitCardUrl(response.data.admitCardUrl);
    } catch (error) {
      console.log(error);
    }
  }

  const handleDownload = () => {
    window.open(admitCardUrl, '_blank');
  }

  return (
    <div>
      <h1>Admit Card Generator</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={userDetails.name} onChange={handleChange} />
        </label>
        <br />
        <label>
          Phone:
          <input type="text" name="phone" value={userDetails.phone} onChange={handleChange} />
        </label>
        <br />
        <label>
          School:
          <input type="text" name="school" value={userDetails.school} onChange={handleChange} />
        </label>
        <br />
        <label>
          Class:
          <input type="text" name="classs" value={userDetails.classs} onChange={handleChange} />
        </label>
        <br />
        <label>
          Roll No:
          <input type="text" name="rollNo" value={userDetails.rollNo} onChange={handleChange} />
        </label>
        <br />
        <label>
          Address:
          <input type="text" name="address" value={userDetails.address} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      {admitCardUrl && <button onClick={handleDownload}>Download Admit Card</button>}
    </div>
  );
}

export default AdmitCardGenerator;
