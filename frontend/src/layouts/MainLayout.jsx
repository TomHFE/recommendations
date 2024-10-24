import { Outlet } from 'react-router-dom';
import NavBar from '../navbar/navbar';

export const MainLayout = () => {
  //  const token = localStorage.getItem("token"); //  check authentication

    return (
        <div style={{ margin: "3rem" }}>
             <NavBar /> 
            <main>
                <Outlet />
            </main>
        </div>
    );
}
