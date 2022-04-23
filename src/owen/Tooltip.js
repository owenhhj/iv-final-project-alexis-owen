import './Tooltip.css';


const fakeSchools = [
  {}
];

export default function Tooltip({
  title='Default Tooltip Title',
  city='Shanghai',
  schoolsData={}
                                }) {


  return (
    <div className={'Tooltip'}>
      <p>{title}</p>
    </div>
  );
};



