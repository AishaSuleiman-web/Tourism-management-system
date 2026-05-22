import FormInput from "../components/FormInput";

function Contact() {
  return (
    <div className="contact">
      <div className="form-head">
         <h1>Contact Us</h1>
        <p>Have a question or need assistance? We're here to help</p>
      </div>
     
      <div className="form">
        <FormInput 
      label= "NAME"
      type= "text"
      placeholder= "Your Name"
      />

      <FormInput
      label= "EMAIL"
      type= "email"
      placeholder= "you@example.com"
      />

      <FormInput
      label= "MESSAGE"
      placeholder= "How can we help you?"
      isTextArea={true}
      />
      <div className="button-container">
        <button className="contact-button">
        Send Message
      </button>
      </div>
      
      </div>

      
    </div>
  )
}

export default Contact