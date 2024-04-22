<%-- Show all records from MySql database --%>

<%@ page import = "java.sql.*" %>
<%@ page import = "java.util.*" %>

<%
	
	try {

		Connection connection = (Connection) session.getAttribute("connection");

		if (connection != null) {

			// out.print(tableName);

			// String tableName = (String) session.getAttribute("tableName");
			String tableName = request.getParameter("tableName");


			String selectQuery = "SELECT * FROM v" + tableName;
		    PreparedStatement statement = connection.prepareStatement(selectQuery);
			// out.print(statement.toString());

			ResultSet resultSetOfRecords = statement.executeQuery();

			if (resultSetOfRecords.isBeforeFirst() == true) {

				StringBuilder jsonRecords = new StringBuilder();
				jsonRecords.append("[");

				while (resultSetOfRecords.next()) {

					jsonRecords.append(resultSetOfRecords.getString(tableName + "Details").trim()).append(",");
				}

				jsonRecords.deleteCharAt(jsonRecords.length() - 1);
				jsonRecords.append("]");

				out.print(jsonRecords.toString());
			}
		}
		else {

			out.print("{error: \"Session was closed!\"}");
		}

	} catch (Exception error) {
		
		out.print("Erorr: " + error);
	}
%>