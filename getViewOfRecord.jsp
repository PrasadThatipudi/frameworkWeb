<%-- Get record from view --%>

<%@ page import = "java.sql.*" %>
<%@ page import = "java.util.*" %>

<%
	Connection connection = (Connection) session.getAttribute("connection");

	if (connection != null) {

		try {

			// String tableName = (String) session.getAttribute("tableName");
			String tableName = request.getParameter("tableName");
			List<String> fieldNames = (List<String>) session.getAttribute("fieldNames");

			String recordId = request.getParameter(fieldNames.get(0));

			String selectQuery = "select * from v" + tableName + " where " + fieldNames.get(0) + " = '" + recordId + "';";
			PreparedStatement statement = connection.prepareStatement(selectQuery);

			ResultSet resultSetOfRecord = statement.executeQuery();

			// out.print("hello");
			while (resultSetOfRecord.next()) {

				out.print("{\"record\":" + resultSetOfRecord.getString(tableName + "Details") + "}");
			}

		} catch (Exception error) {

			out.print(error);
		}
	}
	else {

		out.print("Connection is null!");
	}
%>			