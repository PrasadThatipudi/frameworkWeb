<%-- Save record in MySql database --%>

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

				List<String> newRecord = new ArrayList<>();

				for (String fieldName : fieldNames) {

					newRecord.add(request.getParameter(fieldName));
				}

				String insertQuery = "insert into " + tableName + " values('" + newRecord.get(0) + "'";

				for (int index = 1; index < fieldNames.size(); index++) {

					insertQuery += ", '" + newRecord.get(index) + "'";
				}

				insertQuery += ") on duplicate key update "; 

				for (int index = 1; index < fieldNames.size(); index++) {

					insertQuery += fieldNames.get(index) + " = '" + newRecord.get(index) + "',";
				}

				insertQuery = insertQuery.substring(0, insertQuery.length() - 1);

				insertQuery += ";";

				PreparedStatement statement;

				statement = connection.prepareStatement(insertQuery);

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

				out.print(error);
			}

		}
		else {

			out.print("Connection is null!");
		}
	
	} catch (Exception error) {

		out.print("Error: " + error);
	}
%>