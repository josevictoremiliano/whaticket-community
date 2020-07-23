import React, { useState, useEffect } from "react";

import { Formik, FieldArray } from "formik";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";

import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

import { makeStyles } from "@material-ui/core/styles";

import api from "../../util/api";

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
	},
	textField: {
		// marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		// width: "25ch",
		flex: 1,
	},

	extraAttr: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
}));

const ContactModal = ({
	modalOpen,
	setModalOpen,
	handleAddContact,
	onClose,
	contactId,
}) => {
	const classes = useStyles();
	const initialState = {
		name: "",
		number: "",
		email: "",
		extraInfo: [
			{
				name: "",
				value: "",
			},
		],
	};

	const [contact, setContact] = useState(initialState);

	useEffect(() => {
		const fetchContact = async () => {
			if (!contactId) return;
			const res = await api.get(`/contacts/${contactId}`);
			setContact(res.data);
		};

		fetchContact();
	}, [contactId]);

	const handleClose = () => {
		onClose();
		setContact(initialState);
	};

	const handleSaveContact = async values => {
		if (contactId) {
			await api.put(`/contacts/${contactId}`, values);
		} else {
			await api.post("/contacts", values);
		}
		handleClose();
	};

	console.log(contact);
	console.log("id", contactId);

	return (
		<div className={classes.root}>
			<Dialog
				open={modalOpen}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
				maxWidth="lg"
				// maxHeight="xs"
				scroll="paper"
				className={classes.modal}
			>
				<Formik
					initialValues={contact}
					enableReinitialize={true}
					onSubmit={(values, { setSubmitting }) => {
						setTimeout(() => {
							handleSaveContact(values);
							setSubmitting(false);
						}, 400);
					}}
				>
					{({
						values,
						errors,
						touched,
						handleChange,
						handleBlur,
						handleSubmit,
						isSubmitting,
					}) => (
						<>
							<DialogTitle id="form-dialog-title">
								Adicionar contato
							</DialogTitle>
							<DialogContent dividers>
								<Typography variant="subtitle1" gutterBottom>
									Dados do contato
								</Typography>
								<TextField
									label="Nome"
									name="name"
									value={values.name || ""}
									onChange={handleChange}
									variant="outlined"
									margin="dense"
									required
									className={classes.textField}
								/>
								<TextField
									label="Número do Whatsapp"
									name="number"
									value={values.number || ""}
									onChange={handleChange}
									placeholder="Ex: 13912344321"
									variant="outlined"
									margin="dense"
									required
								/>
								<div>
									<TextField
										label="Email"
										name="email"
										value={values.email || ""}
										onChange={handleChange}
										placeholder="Endereço de Email"
										fullWidth
										margin="dense"
										variant="outlined"
									/>
								</div>
								<Typography
									style={{ marginBottom: 8, marginTop: 12 }}
									variant="subtitle1"
								>
									Informações adicionais
								</Typography>

								<FieldArray name="extraInfo">
									{({ push, remove }) => (
										<>
											{values.extraInfo &&
												values.extraInfo.length > 0 &&
												values.extraInfo.map((info, index) => (
													<div
														className={classes.extraAttr}
														key={`${index}-info`}
													>
														<TextField
															label="Nome do campo"
															name={`extraInfo[${index}].name`}
															value={info.name || ""}
															onChange={handleChange}
															variant="outlined"
															margin="dense"
															required
															className={classes.textField}
														/>
														<TextField
															label="Valor"
															name={`extraInfo[${index}].value`}
															value={info.value || ""}
															onChange={handleChange}
															variant="outlined"
															margin="dense"
															className={classes.textField}
															required
														/>
														<IconButton
															size="small"
															onClick={() => remove(index)}
														>
															<DeleteOutlineIcon />
														</IconButton>
													</div>
												))}
											<div className={classes.extraAttr}>
												<Button
													style={{ flex: 1, marginTop: 8 }}
													variant="outlined"
													color="primary"
													onClick={() => push({ name: "", value: "" })}
												>
													+ Adicionar atributo
												</Button>
											</div>
										</>
									)}
								</FieldArray>
							</DialogContent>
							<DialogActions>
								<Button onClick={handleClose} color="secondary">
									Cancelar
								</Button>
								<Button onClick={handleSubmit} color="primary">
									Adicionar
								</Button>
							</DialogActions>
						</>
					)}
				</Formik>
			</Dialog>
		</div>
	);
};

export default ContactModal;