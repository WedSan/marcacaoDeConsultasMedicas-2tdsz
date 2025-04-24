import theme from "./theme";

const styles = {
  confirmButton: {
    backgroundColor: theme.colors.success,
    borderRadius: 8,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
    borderRadius: 8,
    paddingVertical: 8,
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 20,
  },
};

export default styles;