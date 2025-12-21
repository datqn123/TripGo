import React, { useState } from "react";
import { Dropdown, Form } from "react-bootstrap";
import "./customdropdown.css";

const CustomDropdown = ({ label, options = [], onSelect }) => {
  const [value, setValue] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  // Hỗ trợ cả options dạng string và object {id, name}
  const getOptionName = (option) => {
    return typeof option === "object" ? option.name : option;
  };

  const getOptionId = (option) => {
    return typeof option === "object" ? option.id : option;
  };

  const handleClick = (eventKey) => {
    // Tìm option được chọn dựa trên eventKey (id hoặc string)
    const selectedOption = options.find(
      (opt) => String(getOptionId(opt)) === String(eventKey)
    );

    const displayName = selectedOption ? getOptionName(selectedOption) : eventKey;
    const optionId = selectedOption ? getOptionId(selectedOption) : eventKey;

    setSelectedValue(displayName);
    setValue("");
    setShowOptions(false);

    // Trả về cả id và name cho parent component
    if (onSelect) {
      onSelect({
        id: optionId,
        name: displayName,
      });
    }
  };

  // Filter options dựa trên search value
  const filteredOptions = options.filter((option) => {
    const name = getOptionName(option);
    return !value || name.toLowerCase().includes(value.toLowerCase());
  });

  return (
    <>
      <Dropdown
        className="dropdown-custom"
        onSelect={handleClick}
        onToggle={(isOpen) => {
          if (isOpen && selectedValue) setShowOptions(true);
          if (!isOpen) setShowOptions(false);
        }}
      >
        <Dropdown.Toggle id="dropdown-custom-components">
          <span>{selectedValue ? selectedValue : label}</span>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Form.Control
            autoFocus
            className=" my-1"
            placeholder={label || "Search..."}
            onFocus={() => setShowOptions(true)}
            onChange={(e) => {
              setValue(e.target.value);
              setShowOptions(true);
            }}
            value={value}
          />

          <ul className="list-unstyled">
            {!showOptions && !value && !selectedValue ? (
              <li className="placeholder-item" key="placeholder">
                <button
                  type="button"
                  className="dropdown-placeholder"
                  onClick={() => setShowOptions(true)}
                >
                  {label}
                </button>
              </li>
            ) : (
              filteredOptions.map((option, index) => (
                <li key={getOptionId(option) || index}>
                  <Dropdown.Item eventKey={getOptionId(option)}>
                    {getOptionName(option)}
                  </Dropdown.Item>
                </li>
              ))
            )}
          </ul>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default CustomDropdown;

