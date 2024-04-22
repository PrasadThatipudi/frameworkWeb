<%-- Search record --%>

<%@ page import = "java.sql.*" %>
<%@ page import = "java.util.*" %>
<%-- <%@ include file = "dbConnection.jsp" %> --%>

<%
	Connection connection = (Connection) session.getAttribute("connection");

	if (connection != null) {

		try {

			// String tableName = (String) session.getAttribute("tableName");
			String tableName = request.getParameter("tableName");
			List<String> fieldNames = (List<String>) session.getAttribute("fieldNames");
			String searchTerm = request.getParameter("searchTerm");

			String searchQuery = "select * from v" + tableName + " where " + fieldNames.get(0) + " like '%" + searchTerm + "%';";

			// out.print(searchQuery);

			PreparedStatement statement = connection.prepareStatement(searchQuery);

			ResultSet resultSetOfRecords = statement.executeQuery();


			StringBuilder jsonRecords = new StringBuilder();

			jsonRecords.append("[");

			if (resultSetOfRecords.isBeforeFirst() == true) {

				while (resultSetOfRecords.next()) {

					jsonRecords.append(resultSetOfRecords.getString(tableName + "Details").trim()).append(",");
				}

				jsonRecords.deleteCharAt(jsonRecords.length() - 1);
			}
			
			jsonRecords.append("]");

			out.print(jsonRecords.toString());
			// else {

			// 	out.print("null");
			// }

		} catch (Exception error) {

			out.print("Error: " + error);			
		}

	}
%>
