import Sidebar from "./components/Sidebar.jsx";
import AppRouter from "./components/AppRouter.jsx";
import {BrowserRouter} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {useContext, useEffect, useState} from "react";
import {Context} from "./main.jsx";
import {check} from "./http/usersAPI.js";
import {Flex, Spin} from "antd";

const App = observer(() => {

    const { user } = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        check().then(data => {
            user.setUser(data);
            user.setIsAuthenticated(true);
        }).finally(() => setLoading(false));
    })

    if (loading) {
        return (
            <Flex className="h-[100vh] w-full" align="center" justify='center' gap="middle">
                <Spin size="large" />
            </Flex>
        )
    }

    return (
    <>
        <BrowserRouter>
            <Sidebar>
                <AppRouter/>
            </Sidebar>
        </BrowserRouter>
    </>
  )
});

export default App