<%-- Get error message from Error table --%>

<%@ page import = "java.sql.*" %>

<%
	try {

		Connection connection = (Connection) session.getAttribute("connection");

		if (connection != null) {

			String errorNumber = request.getParameter("ErrorNumber");

			String selectQueryForErrorMessage = "select ErrorMessage from Error where ErrorNumber = ?;";

			PreparedStatement statement = connection.prepareStatement(selectQueryForErrorMessage);
			statement.setString(1, errorNumber);

			ResultSet resultSetOfErrorMessage = statement.executeQuery();

			if (resultSetOfErrorMessage.isBeforeFirst() == true) {
					
				String errorMessage = "";

				while (resultSetOfErrorMessage.next()) {

					errorMessage = resultSetOfErrorMessage.getString("ErrorMessage");
				}

				out.print(errorMessage);
			}
			else {

				out.print("There is no error with error number " + errorNumber + ".");
			}
		}
		else {

			out.print("Connection is null.");
		}

	} catch (Exception error) {

		out.print(error);
	}
%>