import React, { useState, useEffect } from 'react';
import { updateSEO } from '../utils/seo';

export const Admissions: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dob: '',
    photo: null as File | null,
    applyingClass: '',
    streamId: '',
    formerSchool: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    address: '',
    score: ''
  });

  const [availableStreams, setAvailableStreams] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    updateSEO(
      'Admissions | Green Field Secondary School',
      'Embark on a journey of excellence. Apply online for the 2026 academic year at Greenfield Secondary School Masindi.'
    );
  }, []);

  // Update mock streams when the applying class changes
  useEffect(() => {
    if (!formData.applyingClass) {
      setAvailableStreams([]);
      setFormData(prev => ({ ...prev, streamId: '' }));
      return;
    }

    // Mock streams mapping
    const classLevel = formData.applyingClass;
    if (['S.1', 'S.2', 'S.3', 'S.4'].includes(classLevel)) {
      setAvailableStreams([
        { id: '1', name: 'Stream A (Blue)' },
        { id: '2', name: 'Stream B (Red)' },
        { id: '3', name: 'Stream C (Green)' }
      ]);
    } else if (['S.5', 'S.6'].includes(classLevel)) {
      setAvailableStreams([
        { id: '4', name: 'Sciences Combination Stream' },
        { id: '5', name: 'Arts Combination Stream' }
      ]);
    }
    setFormData(prev => ({ ...prev, streamId: '' }));
  }, [formData.applyingClass]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, photo: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Phone validation for Uganda (+256...)
    const phoneRegex = /^\+256[0-9]{9}$/;
    if (!phoneRegex.test(formData.guardianPhone)) {
      setErrorMessage('Please enter phone number in format: +256XXXXXXXXX (where X is 9 digits)');
      return;
    }

    // Mock successful submission
    console.log('Form data submitted:', formData);
    setIsSubmitSuccess(true);
  };

  const handleCloseModal = () => {
    setIsSubmitSuccess(false);
    // Reset form
    setFormData({
      fullName: '',
      gender: '',
      dob: '',
      photo: null,
      applyingClass: '',
      streamId: '',
      formerSchool: '',
      guardianName: '',
      guardianPhone: '',
      guardianEmail: '',
      address: '',
      score: ''
    });
  };

  return (
    <div>
      {/* Hero Header */}
      <section className="hero" style={{ background: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/photos/school-entrance.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', height: 'auto', padding: '100px 5%' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', textShadow: '2px 2px 4px rgba(0,0,0,0.7)', textAlign: 'center', color: 'white' }}>
          Join Greenfield Secondary School
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', margin: '15px auto 0', textAlign: 'center', color: 'white' }}>
          Embark on a journey of excellence in education. Apply now for the 2026 academic year and become part of our vibrant community dedicated to nurturing future leaders.
        </p>
      </section>

      <div className="container">
        <div className="admission-card">
          <h2>2026 Admission Requirements</h2>
          <div className="requirements">
            <ul>
              <li>PLE or UCE Result Slip / Testimonial</li>
              <li>Recommendation Letter from former school</li>
              <li>Two recent passport-sized photographs</li>
              <li>Completed health certificate / medical form</li>
            </ul>
          </div>

          <h2 style={{ marginTop: '40px' }}>Online Admission Application</h2>

          {errorMessage && (
            <div style={{ background: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '5px', marginBottom: '20px', border: '1px solid #f5c6cb' }}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label htmlFor="fullName">Student Full Name</label>
            <input 
              type="text" 
              id="fullName" 
              name="fullName" 
              value={formData.fullName} 
              onChange={handleChange} 
              required 
            />

            <label htmlFor="gender">Gender</label>
            <select 
              id="gender" 
              name="gender" 
              value={formData.gender} 
              onChange={handleChange} 
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <label htmlFor="dob">Date of Birth</label>
            <input 
              type="date" 
              id="dob" 
              name="dob" 
              value={formData.dob} 
              onChange={handleChange} 
              required 
            />

            <label htmlFor="photo">Student Photo (Optional)</label>
            <input 
              type="file" 
              id="photo" 
              name="photo" 
              accept="image/*" 
              onChange={handleFileChange} 
            />

            <label htmlFor="applyingClass">Class Applying For</label>
            <select 
              id="applyingClass" 
              name="applyingClass" 
              value={formData.applyingClass} 
              onChange={handleChange} 
              required
            >
              <option value="">Select Class</option>
              <option value="S.1">S.1</option>
              <option value="S.2">S.2</option>
              <option value="S.3">S.3</option>
              <option value="S.4">S.4</option>
              <option value="S.5">S.5</option>
              <option value="S.6">S.6</option>
            </select>

            <label htmlFor="streamId">Stream</label>
            <select 
              id="streamId" 
              name="streamId" 
              value={formData.streamId} 
              onChange={handleChange} 
              required 
              disabled={!formData.applyingClass}
            >
              <option value="">
                {formData.applyingClass ? 'Select Stream' : 'Select Class First'}
              </option>
              {availableStreams.map(stream => (
                <option key={stream.id} value={stream.id}>
                  {stream.name}
                </option>
              ))}
            </select>

            <label htmlFor="formerSchool">Former School</label>
            <input 
              type="text" 
              id="formerSchool" 
              name="formerSchool" 
              value={formData.formerSchool} 
              onChange={handleChange} 
              required 
            />

            <label htmlFor="guardianName">Parent / Guardian Name</label>
            <input 
              type="text" 
              id="guardianName" 
              name="guardianName" 
              value={formData.guardianName} 
              onChange={handleChange} 
              required 
            />

            <label htmlFor="guardianPhone">Parent / Guardian Phone</label>
            <input 
              type="tel" 
              id="guardianPhone" 
              name="guardianPhone" 
              placeholder="+256XXXXXXXXX" 
              value={formData.guardianPhone} 
              onChange={handleChange} 
              required 
            />

            <label htmlFor="guardianEmail">Parent / Guardian Email (Optional)</label>
            <input 
              type="email" 
              id="guardianEmail" 
              name="guardianEmail" 
              value={formData.guardianEmail} 
              onChange={handleChange} 
            />

            <label htmlFor="address">Residential Address</label>
            <textarea 
              id="address" 
              name="address" 
              rows={4}
              value={formData.address} 
              onChange={handleChange} 
              required
            ></textarea>

            <label htmlFor="score">Total Score / Aggregates Acquired</label>
            <input 
              type="number" 
              id="score" 
              name="score" 
              step="0.01" 
              min="0" 
              max="100" 
              placeholder="PLE Aggregates or UCE percentage"
              value={formData.score} 
              onChange={handleChange} 
              required 
            />

            <button type="submit" className="btn-dl" style={{ display: 'block', width: '100%', marginTop: '20px' }}>
              Submit Application
            </button>
          </form>
        </div>

        {/* School Highlights section */}
        <section className="school-highlights">
          <div className="highlights-content">
            <div className="highlights-text">
              <h3>Why Choose Greenfield Secondary School?</h3>
              <p>
                At Greenfield Secondary School, we pride ourselves on providing a holistic education that combines academic excellence with character development. Our state-of-the-art facilities, dedicated faculty, and commitment to values like hard work and integrity make us the ideal choice for your child's future.
              </p>
              <p>
                Located in the heart of Masindi, Uganda, our school offers a nurturing environment where students thrive academically, socially, and personally. Join a community that believes in "Hard Work Pays" and watch your child grow into a confident, responsible individual.
              </p>
            </div>
            <div className="highlights-image">
              <img src="/photos/school-entrance.jpg" alt="Greenfield Secondary School Facilities" />
            </div>
          </div>
        </section>
      </div>

      {/* Success Modal */}
      {isSubmitSuccess && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <i className="fas fa-check-circle"></i>
            <h3>Application Received!</h3>
            <p>
              Thank you for applying to Greenfield Secondary School. Your application has been logged successfully. We will review your details and contact you shortly.
            </p>
            <button className="btn" onClick={handleCloseModal}>
              Close Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
