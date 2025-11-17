import './toggle.css'
function Toggle(){
  return(
    <label class="switch">
      <input type="checkbox" className='checkbox'/>
      <div className ="slider"></div>
    </label>
  );
}

export default Toggle;