import { useState } from 'react';
import { Modal } from '@/app/Shared/Modal';

function EditGroupModal() {
  const [showEditGroupForm, setShowEditGroupForm] = useState();

  return (
    <div>
      {/* edit group modal */}
      <Modal
        title="Edit Group"
        isOpen={showEditGroupForm}
        setIsOpen={setShowEditGroupForm}
      >
        <div style={{ padding: '16px' }}>
          <label>Enter Group Name:</label>
          <input
            type="text"
            value={newGroupName}
            onChange={handleGroupNameChange}
            style={{
              borderWidth: '1px',
              borderColor: '#3498db',
              borderRadius: '4px',
              padding: '8px',
              outline: 'none',
              width: '100%',
            }}
            placeholder="Group Name"
          />
          <button
            className="mt-10 cursor-pointer rounded bg-red-500 px-4 py-2 font-bold text-white outline-none hover:bg-red-700"
            onClick={}
          >
            Edit group
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default EditGroupModal;
