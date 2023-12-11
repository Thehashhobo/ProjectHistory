
import { Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Input, DrawerFooter, Button ,VStack  } from '@chakra-ui/react';
import NotificationCard from './notificationCard';
import React, {useState, useEffect} from 'react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import axios from 'axios';


function NotificationDrawer({ isOpen, onClose , notificationList}) {
    const [notifications, setNotifications] = useState(notificationList); 
    const [reversed, setReversed] = useState(false)

    useEffect(() => {
        setNotifications(notificationList);
    }, [notificationList]);

    const removeNotification = (id) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
        handleUpdate(id)
    };

    const handleUpdate = async (id) => {
        const queryString = `http://127.0.0.1:8000/notifications/${id}/`;
    
        try {
            const accessToken = localStorage.getItem('access_token');
            await axios.patch(queryString, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            console.log(`Pet listing with ID ${id} deleted successfully`);
            // You might want to update the UI or redirect the user
        } catch (error) {
            console.error('Error deleting pet listing:', error);
            // Handle any errors, such as displaying a message to the user
        }
    };


    const reverseOrdering = () => {
        setReversed(!reversed);
        setNotifications(notifications.reverse());
    }
  return (
    <Drawer
      isOpen={isOpen}
      placement='right'
      onClose={onClose}
    //   colorScheme={blue}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth='1px'>My Notifications
        <Button rightIcon={reversed ? <TriangleUpIcon /> : <TriangleDownIcon />} onClick={reverseOrdering} marginLeft={'8px'}>
        Sort
        </Button>
        </DrawerHeader>
        <DrawerBody>
          <VStack spacing={4}>
          {notifications.map(notification => (
                <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onRemove={removeNotification}
                    handleUpdate={handleUpdate}
                />
            ))}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default NotificationDrawer;
