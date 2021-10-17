import { Button, ClickAwayListener, Tooltip } from "@mui/material"
import ShareIcon from "@mui/icons-material/Share"
import { useCallback, useState } from "react"

export function ShareButton() {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const handleTooltipClose = useCallback(() => {
    setTooltipOpen(false)
  }, [setTooltipOpen])

  const share = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);

    setTooltipOpen(true)
    setTimeout(() => {
      setTooltipOpen(false)
    }, 1500)
  }, [setTooltipOpen])

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Tooltip
        PopperProps={{
          disablePortal: true
        }}
        onClose={handleTooltipClose}
        open={tooltipOpen}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        title="Nonogram URL saved in your clipboard."
      >
        <Button
          variant="contained"
          color="secondary"
          startIcon={<ShareIcon />}
          onClick={share}
        >
          Share Nonogram
        </Button>
      </Tooltip>
    </ClickAwayListener>
  )
}
