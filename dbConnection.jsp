<%-- Connect to MySql database --%>

<%-- Show matched record data --%>

<%@ page import = "java.sql.*" %>
<%-- <%@ page import = "java.util.*" %> --%>

<%
	// Connection connection = null;
	String url = "jdbc:mysql://138.68.140.83:3306/dbPrasad";
	String username = "Prasad";
	String password = "Prasad@123";
	// String columnNameOfView = "ItemDetails";

	// List<String> fieldNames = new ArrayList<>();

	try {

		Connection connection = (Connection) session.getAttribute("connection");
		// String tableName = request.getParameter("tableName");
		// session.setAttribute("tableName", tableName);
		// connection = null;

		if (connection == null) {
			
			Class.forName("com.mysql.jdbc.Driver");

			connection = DriverManager.getConnection(url, username, password);

			if (connection != null) {

				session.setAttribute("connection", connection);
				// session.setAttribute("columnNameOfView", columnNameOfView);

				// out.print("sessions saved!");
				// out.print("{\"status\": true}");
			}
			else {

				out.println("Error occurred while connecting to database!");
			}
		}
		// else {

			// out.print("{\"status\": true}");
			// out.print("Connection is not null.");
		// }
	
	} catch (Exception error) {

		out.println("{\"status\": " + '\"' + error + '\"');
		
	}
%>