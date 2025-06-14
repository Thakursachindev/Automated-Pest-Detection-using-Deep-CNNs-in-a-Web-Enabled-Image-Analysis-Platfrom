import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div>
      {/* Other sidebar items */}
      <Link to="/lookup">Pest Info Lookup</Link>  {/* Link to the Lookup page */}
    </div>
  );
}
