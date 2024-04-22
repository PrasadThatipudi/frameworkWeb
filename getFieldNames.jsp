<%-- Get field names of table Item --%>

<%-- <%@ include file = "dbConnection.jsp" %> --%>
<%@ page import = "java.sql.*" %>
<%@ page import = "java.util.*" %>

<%
	try {


		Connection connection = (Connection) session.getAttribute("connection");


		if (connection != null) {

			// List<String> fieldNames = (List<String>) session.getAttribute("fieldNames");

			// String tableName = (String) session.getAttribute("tableName");
			String tableName = request.getParameter("tableName");
			List<String> fieldNames = new ArrayList<>();
			String selectQueryForDescription = "select * from " + tableName + ";";

			Statement statement = connection.createStatement();

			ResultSet resultSet = statement.executeQuery(selectQueryForDescription);
			ResultSetMetaData metaData = resultSet.getMetaData();

			int columnCount = metaData.getColumnCount();

			// out.print("columnCount: " + columnCount);

			for (int index = 1; index <= columnCount; index++) {

				fieldNames.add(metaData.getColumnName(index));
			}

			// for (int index = 0; index < fieldNames.size(); index++) {

			// 	out.print("<br>" + fieldNames.get(index));
			// }

			StringBuilder fieldNamesInJson = new StringBuilder();

			fieldNamesInJson.append("{\"Field\":[");

			for (int index = 0; index < fieldNames.size(); index++) {

				// out.print(fieldNames.get(index));

				fieldNamesInJson.append('\"').append(fieldNames.get(index)).append('\"').append(",");
			}

			fieldNamesInJson.deleteCharAt(fieldNamesInJson.length() - 1);

			fieldNamesInJson.append("]}");

			out.print(fieldNamesInJson.toString());

			session.setAttribute("fieldNames", fieldNames);
		}
		else {
			
			out.print("connection is null");
		}

	} catch (Exception error) {

		out.print("Error: " + error);		
	}
%>