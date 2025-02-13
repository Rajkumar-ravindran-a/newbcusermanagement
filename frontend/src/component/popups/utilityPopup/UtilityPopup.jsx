import {Modal, Box, IconButton, Button } from "@mui/material";
import { useSelector, useDispatch } from 'react-redux'
import {toggle} from '../../../redux/popups/PopupsSlice.js'
import { Tab, Tabs, Card, CardBody, Input } from "@nextui-org/react";
import { Avatar } from "@nextui-org/react";
import {     useState } from "react";


const UtilityPopup = ({data}) => {
  const poper = useSelector((state)=> state.profile.value)  
  const dispatch = useDispatch()
  const [editPwd, setEditPwd] = useState(false)

  const handleEditPwd = () =>{
    setEditPwd(!editPwd)
  }
   
  const profileSection = () =>{
    return (
      <div>
        <div className="mt-3">
            <Avatar size="lg" name="John Doe" />
        </div>
        <div className="mt-4 flex w-full gap-2">
            <div className="w-full">
                <Input label="First Name" type="text" disabled value={"John"}/>
            </div>
            <div className="w-full">
                <Input label="Last Name" type="text" disabled value={"Deo"}/>
            </div>
        </div>
        <div className="mt-4 flex gap-2">
            <Input label="email" type="email" disabled value={"John Deo"}/>
            <Input label="Phone Number" type="tel" disabled value={"+1 123 456 7890"}/>
        </div>

        <div className="flex mt-4 gap-2">
            <Input label="Old Password" type="Password" disabled value={"1234 Main St"}/>
            <Input label="New Password" type="Password" disabled value={"New York"}/>
        </div>

        <div className="mt-4 flex gap-2 flex-row-reverse">
            <Button variant="contained" className="mt-3" onClick={()=>handleEditPwd()}>{!editPwd ? "Edit" : "update"}</Button>
            <Button variant="contained" color="secondary"  className="mt-3">Cancel</Button>
        </div>
      </div>
    )
  }
  
  let tabs = [
    {
      id: "Profile",
      label: "Profile",
      content: profileSection(),
    },
    {
      id: "Settings",
      label: "Settings",
      content:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    },
    // {
    //   id: "videos",
    //   label: "Videos",
    //   content:
    //     "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    // },
  ];
  const handleClose = () =>{
        dispatch(toggle())
  }

  return (
    <Modal open={poper} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "45%",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          overflowY: "auto",
          height: "82%",
        }}
      >
        <Tabs aria-label="Dynamic tabs" items={tabs}>
        {(item) => (
          <Tab key={item.id} title={item.label} >
            <Card style={{ height: "70%" }}>
              <CardBody>{item.content}</CardBody>
            </Card>
          </Tab>
        )}
        </Tabs>
      </Box>
    </Modal>
  );
};

export default UtilityPopup;
