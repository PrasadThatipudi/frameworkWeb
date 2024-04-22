<%-- Delete record from MySql database --%>

<%@ page import = "java.sql.*" %>
<%@ page import = "java.util.*" %>

<%
	
	try {

		Connection connection = (Connection) session.getAttribute("connection");

		if (connection != null) {

			try {

				// String tableName = (String) session.getAttribute("tableName");
				String tableName = request.getParameter("tableName");
				List<String> fieldNames = (List<String>) session.getAttribute("fieldNames");

				String recordId = request.getParameter(fieldNames.get(0));

				String deleteQuery = "delete from " + tableName + " where " + fieldNames.get(0) + " = ?;";

				PreparedStatement statement = connection.prepareStatement(deleteQuery);

				statement.setString(1, recordId);

				int rowsAffected = statement.executeUpdate();

				out.print(rowsAffected);

			} catch (SQLException error) {

				int errorNumber = error.getErrorCode();

				if (errorNumber == 1644) {

					out.print(error.getMessage());
				}
				else {

					out.print(errorNumber);
				}

			} catch (Exception error) {

				out.print("Error: " + error);			
			}
		}

		else {

			out.print("Connection is null");
		}

	} catch (Exception error) {

		out.print("Error: " + error);
	}
%>