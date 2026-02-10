import React from "react";
import { IconButton, ButtonGroup, Tooltip } from "@mui/material";
import {
  DeleteIcon,
  EditIcon,
  PowerIcon,
  DisabledPowerIcon,
  DisableEditIcon,
  DisabledDeleteIcon,
  DisabledRemoveIcon,
  ApplyPaymentIcon,
  DisabledApplyPaymentIcon,
  UnApplyPaymentIcon,
  DisabledUnApplyPaymentIcon,
} from "../../../assets/icons";
import { RemoveIcon } from "../../../assets/icons";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
// import AddIcon from "@mui/icons-material/Add";
import AddIcon from '@mui/icons-material/AddCircleOutlineOutlined';
const EditableButton = ({
  deleteButtonClicked,
  editButtonClicked,
  powerButtonClicked,
  hideDeleteButton = false,
  PowerButton = false,
  powerButtonDisabled = false,
  deleteButtonDisabled = false,
  showDisabledPowerButton = false,
  addIconShow = false,
  addIconClicked,
  editButtonDisabled = false,
  editIconTitle = "",
  deleteButtonShow = true,
  cancelIcon = false,
  infoButton = false,
  infoButtonClick,
  editButtonShow = true,
  children,
  infoIconColor = "#1C2A39",
  applyAction = false,
  applyIconTitle,
  applyIconDisabled = false,
  unApplyAction = false,
  unApplyIconTitle,
  unApplyIconDisabled = false,
  applyButtonClicked,
  unApplyButtonClicked,
}) => {
  return (
    <ButtonGroup disableElevation variant="outlined">
      {applyAction && (
        <>
          {applyIconDisabled ? (
            <Tooltip title={""} disableInteractive>
              <span>
                <IconButton onClick={applyButtonClicked} disabled={true}>
                  <DisabledApplyPaymentIcon />
                </IconButton>
              </span>
            </Tooltip>
          ) : (
            <Tooltip title={applyIconTitle} disableInteractive>
              <span>
                <IconButton
                  // classes={{
                  //   root: classes.iconContainer,
                  // }}
                  sx={{ color: "blue" }}
                  onClick={applyButtonClicked}
                >
                  <ApplyPaymentIcon />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </>
      )}
      {unApplyAction && (
        <>
          {unApplyIconDisabled ? (
            <Tooltip title={""} disableInteractive>
              <span>
                <IconButton disabled={true}>
                  <DisabledUnApplyPaymentIcon
                    sx={{ fontSize: 26 }}
                    fontSize="medium"
                  />
                </IconButton>
              </span>
            </Tooltip>
          ) : (
            <Tooltip title={unApplyIconTitle} disableInteractive>
              <span>
                <IconButton
                  onClick={unApplyButtonClicked}
                  disabled={unApplyIconDisabled}
                  variant="transparent"
                >
                  <UnApplyPaymentIcon
                    sx={{ fontSize: 26 }}
                    color="error"
                    fontSize="medium"
                  />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </>
      )}
      {editButtonShow && (
        <>
          {editButtonDisabled ? (
            <Tooltip title={editIconTitle} disableInteractive>
              <span>
                <IconButton disabled={editButtonDisabled} variant="transparent">
                  <DisableEditIcon />
                </IconButton>
              </span>
            </Tooltip>
          ) : (
            <Tooltip title="Edit" disableInteractive>
              <IconButton
                disabled={editButtonDisabled}
                onClick={editButtonClicked}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
        </>
      )}

      {PowerButton && (
        <Tooltip title="Deactivate" disableInteractive>
          <IconButton onClick={powerButtonClicked} variant="transparent">
            <PowerIcon />
          </IconButton>
        </Tooltip>
      )}
      {showDisabledPowerButton && (
        <Tooltip>
          <IconButton
            disabled={true}
            onClick={powerButtonClicked}
            variant="transparent"
          >
            <DisabledPowerIcon />
          </IconButton>
        </Tooltip>
      )}
      {deleteButtonShow && (
        <>
          {!hideDeleteButton && (
            <Tooltip
              title={cancelIcon ? "Cancel" : "Delete"}
              disableInteractive
            >
              <IconButton
                disabled={deleteButtonDisabled}
                onClick={deleteButtonClicked}
                variant="transparent"
              >
                {cancelIcon ? <RemoveIcon /> : <DeleteIcon />}
              </IconButton>
            </Tooltip>
          )}
          {hideDeleteButton && (
            <Tooltip title="Delete" disableInteractive>
              <IconButton
                disabled={true}
                onClick={deleteButtonClicked}
                variant="transparent"
              >
                {cancelIcon ? (
                  <DisabledRemoveIcon style={{ color: "green" }} />
                ) : (
                  <DisabledDeleteIcon />
                )}
              </IconButton>
            </Tooltip>
          )}
        </>
      )}
      {infoButton && (
        <Tooltip title="Info" disableInteractive>
          <IconButton
            disabled={false}
            onClick={infoButtonClick}
            variant="transparent"
          >
            <InfoOutlinedIcon
              sx={{
                color: infoIconColor,
              }}
            />
          </IconButton>
        </Tooltip>
      )}
      {addIconShow && (
        <Tooltip title="Add" disableInteractive>
          <IconButton
            disabled={false}
            onClick={addIconClicked}
            variant="transparent"
          >
            <AddIcon
              sx={{
                color: infoIconColor,
              }}
            />
          </IconButton>
        </Tooltip>
      )}
      {children}
    </ButtonGroup>
  );
};
export default EditableButton;
