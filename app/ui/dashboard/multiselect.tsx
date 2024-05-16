// MultipleSelectCheckmarks.tsx
import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { useState, useEffect } from 'react';
import { environment } from '@/environment/environment';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 2.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface MultipleSelectCheckmarksProps {
  senderIds: string[];
  onSenderIdsChange: (newSenderIds: string[]) => void;
  options: string[];
}

export default function MultipleSelectCheckmarks({
  // senderIds,
  onSenderIdsChange,
  // options,
}: MultipleSelectCheckmarksProps) {
  const [sendersId, setSendersId] = useState([]);
  const [senders, setSenders] = useState([]);

  const [selectedSendersLabel, setSelectedSendersLabel] = useState([]);
  useEffect(() => {
    const fetchSenderId = async () => {
      const token = localStorage.getItem('accessToken'); // Retrieve the token
      if (!token) {
        console.error('No access token available.');
        return;
      }
      const accessToken = localStorage.getItem('accessToken');
      const dev_url = environment.dev_url;
      try {
        const response = await fetch(`${dev_url}/api/v1/client-senderIDs`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log(data, 'data');
        setSenders(data.data.content);
      } catch (error) {
        console.error('Failed to fetch senderId:', error);
      }
    };

    fetchSenderId();
  }, []);
  useEffect(() => console.log(sendersId), [sendersId]);
  // useEffect(() => {
  //   console.log('This are the sender Ids', senderId);
  //   console.log('check id', id);
  // }, [senderId, id]);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const selectedSenderId: any = event.target.value;
    setSendersId([...sendersId, selectedSenderId[0].toString()]);
    // const sender = senders.find(
    //   (option: any) => option.id === selectedSenderId[0],
    // );
    // console.log(sender, selectedSendersLabel, sender?.senderID);
    // if (sender) {
    //   const senders = [...selectedSendersLabel, sender.senderID];
    //   setSelectedSendersLabel(senders);
    // }
    // console.log(selectedSendersLabel, sendersId);
    // const selectedIds: any[] = [];

    // selectedSenderIds.forEach((senderId: string) => {
    //   // Find the index of the senderId in the senderIds array
    //   const index = senderIds.indexOf(senderId);
    //   // If the senderId is found (index is not -1), push the corresponding id to selectedIds
    //   if (index !== -1) {
    //     selectedIds.push(id[index]); // Use the id array to get the corresponding id
    //     console.log(id[index]);
    //     console.log('These are the selected ids', selectedIds);
    //   }
    // });

    // Update the parent component's state with selected ids
    // onSenderIdsChange(selectedIds);
  };

  return (
    <FormControl fullWidth sx={{ m: 1 }}>
      <InputLabel id="sender-id-select-label">Sender IDs</InputLabel>
      <Select
        labelId="sender-id-select-label"
        id="sender-id-select"
        multiple
        value={sendersId}
        onChange={handleChange}
        input={<OutlinedInput label="Sender IDs" />}
        renderValue={(selected) => selected.join(', ')}
        MenuProps={MenuProps}
        className="rounded border border-gray-300 p-2"
      >
        {senders.map((item) => {
          console.log(item);
          return (
            <MenuItem key={item.id}>
              <Checkbox checked={senders.includes(item.senderID)} />
              {item.senderID}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
