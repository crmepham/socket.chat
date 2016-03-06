package test.selenium.functionality;

import org.junit.Before;
import org.openqa.selenium.Alert;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;

import test.selenium.AbstractWebTest;
import test.selenium.SeleniumHelper;

public class FunctionalityTest extends AbstractWebTest {

	@Before
	public void setUp() throws Exception {
		super.setUp();
		SeleniumHelper.goTo(driver, baseUrl);
	}
	
	public void testHomeView() {
		assertEquals(baseUrl, driver.getCurrentUrl());
	}
	
	public void testChatRoomName() {
		try{
			sendInvalidRoomName("$");
			sendInvalidRoomName("%");
			sendInvalidRoomName("(");
			sendInvalidRoomName(")");
			sendInvalidRoomName("+");
			sendInvalidRoomName("=");
			sendInvalidRoomName("£");
			sendInvalidRoomName("\"");
			sendInvalidRoomName("!");
			sendInvalidRoomName("`");
			sendInvalidRoomName("*");
			sendInvalidRoomName("<");
			sendInvalidRoomName(">");
			sendInvalidRoomName("@");
			sendInvalidRoomName(":");
			sendInvalidRoomName(";");
			sendInvalidRoomName("?");
			sendInvalidRoomName("^");
		} catch(Exception e) {
			fail("Invalid character was accepted: " +  e.getMessage());
		}
		
		SeleniumHelper.inputText(driver, "create-room-name-large", "test room");
		Alert a = SeleniumHelper.getAlert(driver);
		assertEquals("Enter username:", a.getText());
		a.dismiss();
		
	}
	
	public void testRandomRoomName() {
		SeleniumHelper.findElementById(driver, "randomize-large").click();
		Alert a = SeleniumHelper.getAlert(driver);
		assertEquals("Enter username:", a.getText());
		a.dismiss();
	}
	

	public void testEnterChatRoom() {
		SeleniumHelper.inputText(driver, "create-room-name-large", "test room");
		Alert a = SeleniumHelper.getAlert(driver);
		assertEquals("Enter username:", a.getText());
		
		try{
			sendInvalidUsername(a, " ");
			sendInvalidUsername(a, "\"");
			sendInvalidUsername(a, ",");
			sendInvalidUsername(a, "<");
			sendInvalidUsername(a, ">");
			sendInvalidUsername(a, "#");
			sendInvalidUsername(a, "$");
			sendInvalidUsername(a, "12345678910111213");
		} catch(Exception e) {
			fail("Invalid character was accepted");
		}
		sendValidKeys(a, "testUser");
		assertEquals(baseUrl + "r/test%20room", driver.getCurrentUrl());
	}
	
	
	
	public void testChatMessage() throws InterruptedException {
		enterChatRoom();
		sendMessage("TESTING");
		Thread.sleep(1500L);
		assertTrue(SeleniumHelper.findElementById(driver, "messages").getText().contains("TESTING"));
	}

	
	public void testChatPrivateMessage() {
		enterChatRoom();
		sendMessage("/tell testUser test message");
		assertTrue(SeleniumHelper.findElementById(driver, "messages").getText().contains("Unable to send PM."));
	}
	
	public void testMessageTimeStamp() {
		enterChatRoom();
		sendMessage("/timestamp");
		assertTrue(SeleniumHelper.findElementById(driver, "messages").getText().contains("Message timestamps are enabled."));
	}
	
	public void testClickLogoReturnsToHomeView() {
		enterChatRoom();
		SeleniumHelper.findElementById(driver, "logo-icon").click();
		assertEquals(baseUrl, driver.getCurrentUrl());
	}
	
	public void testChangeTheme() {
		enterChatRoom();
		sendMessage("/theme doslight");
		assertTrue(SeleniumHelper.findElementById(driver, "messages").getText().contains("Theme changed to doslight."));
	}
	
	public void testChatCommands() {
		enterChatRoom();
		sendMessage("/clear");
		assertTrue(SeleniumHelper.findElementById(driver, "messages").getText().isEmpty());
		
		sendMessage("/help");
		assertTrue(SeleniumHelper.findElementById(driver, "messages").getText().contains("Available commands"));
		
		sendMessage("/themes");
		assertTrue(SeleniumHelper.findElementById(driver, "messages").getText().contains("Available themes"));
		
		sendMessage("/users");
		assertTrue(SeleniumHelper.findElementById(driver, "messages").getText().contains("Users online"));
		
		sendMessage("/pmnotify");
		assertTrue(SeleniumHelper.findElementById(driver, "messages").getText().contains("Private message sound notifications have been enabled."));
		
		sendMessage("/chatnotify");
		assertTrue(SeleniumHelper.findElementById(driver, "messages").getText().contains("Chat sound notifications have been enabled."));
		
		sendMessage("/mute");
		assertTrue(SeleniumHelper.findElementById(driver, "messages").getText().contains("Please choose a user to mute"));
		
		sendMessage("/unmute");
		assertTrue(SeleniumHelper.findElementById(driver, "messages").getText().contains("Please specify a user"));
		
		sendMessage("/mutelist");
		assertTrue(SeleniumHelper.findElementById(driver, "messages").getText().contains("No users are muted"));
		
		sendMessage("/rules");
		assertTrue(SeleniumHelper.findElementById(driver, "messages").getText().contains("Rules: 1)"));
	}
	
	public void testClickUsernameToPm() throws InterruptedException {
		enterChatRoom();
		Thread.sleep(1000L);
		SeleniumHelper.clickLinkByValue(driver, "testUser");
		Thread.sleep(1000L);
		WebElement e = SeleniumHelper.findElementById(driver, "message-input");
		e.sendKeys(Keys.RETURN);
		Thread.sleep(1000L);
		String test = SeleniumHelper.findElementById(driver, "messages").getText();
		assertTrue(test.contains("Unable to send PM."));
	}
	
	private void sendMessage(String msg){
		WebElement e = SeleniumHelper.findElementById(driver, "message-input");
		e.sendKeys("/clear");
		e.sendKeys(Keys.RETURN);
		e.sendKeys(msg);
		e.sendKeys(Keys.RETURN);
	}
	
	private void enterChatRoom() {
		SeleniumHelper.inputText(driver, "create-room-name-large", "test room");
		Alert a = SeleniumHelper.getAlert(driver);
		a.sendKeys("testUser");
		a.accept();
	}
	
	private void sendInvalidRoomName(String key) throws Exception {
		SeleniumHelper.inputText(driver, "create-room-name-large", key);
		Alert a = SeleniumHelper.getAlert(driver);
		if(!a.getText().contains("Unable to create room")) {
			throw new Exception(key);
		}
		a.accept();
	}
	
	private void sendValidKeys(Alert a, String key){
		a.sendKeys(key);
		a.accept();
		
	}
	
	private void sendInvalidUsername(Alert a, String key) throws Exception {
		a.sendKeys(key);
		a.accept();
		a = SeleniumHelper.getAlert(driver);
		if(!a.getText().contains("Invalid")) {
			throw new Exception();
		}
		
	}
	
}
