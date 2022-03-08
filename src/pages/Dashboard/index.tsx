import * as React from "react";
import Actions from "./Actions";

const Dashboard = () => {
  const ref = React.useRef(null);

  return (
    <div className="container py-4" ref={ref}>
      <div className="row">
        <div className="col-12 col-md-10 mx-auto">
          <div className="card shadow-sm rounded border-0">
            <div className="card-body p-1">
              <div className="card rounded border-0 bg-primary">
                <div className="card-body text-center p-4">
                  <Actions />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
