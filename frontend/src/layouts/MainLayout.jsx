import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
    return (
        <div style={{margin: "3rem"}}>
            <div style={{marginTop: "2rem", marginBottom: "2rem", backgroundColor: "blue"}}>This could be the navbar</div>
            <Outlet />
            
        </div>
    )
}