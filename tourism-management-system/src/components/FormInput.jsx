import "./FormInput.css";

function FormInput({ label, type, placeholder, isTextArea}){
  return (
    <div className="form-group">

      <label className="form-label">{label}</label>

      {isTextArea ? (
        <textarea
        className="form-input textarea"
        placeholder={placeholder}
        />
      ) : (
      <input className="form-input" 
      type={type}
      placeholder={placeholder} />
      )}
      
    </div>
  )
}

export default FormInput;