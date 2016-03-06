package test.selenium;

import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.NoAlertPresentException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import junit.framework.TestCase;

/**
 * A helper class to simplify the use of the Selenium framework.
 * 
 * @author crm
 *
 */
public class SeleniumHelper extends TestCase {

	public static void goTo(WebDriver driver, String url) {
    	driver.get(url);
    }

	public static WebElement findElementById(WebDriver driver, String id) {
		return driver.findElement(By.id(id.trim()));
	}
	
	public static WebElement findElementByClass(WebDriver driver, String string) {
		return driver.findElement(By.className(string.trim()));
	}
	
	public static WebElement findElementByXpath(WebDriver driver, String xpath) {
		return driver.findElement(By.xpath(xpath.trim()));
	}
	
	public static void clickLinkById(WebDriver driver, String id) {
		WebElement e = findElementById(driver, id);
		e.click();
	}
	
	public static void clickLinkByValue(WebDriver driver, String value) {
		String xPath = String.format("(//a[@value='%s' or .='%s'])", value, value);
		WebElement e = findElementByXpath(driver, xPath);
		e.click();
	}
	
	public static void clickNamedButton(WebDriver driver, String value) {
		WebElement e = findElementByXpath(driver, String.format("(//input[@value='%s' or .='%s'])", value, value));
		e.click();
	}
	
	public static void sendMessage(WebDriver driver, String msg) {
		
	}
	
	public static void inputText(WebDriver driver, String id, String input) {
		WebElement e = findElementById(driver, id);
		e.clear();
		e.sendKeys(input);
		e.sendKeys(Keys.RETURN);
	}
	
	public static Alert getAlert(WebDriver driver) {
		try{
			return driver.switchTo().alert();
		} catch(NoAlertPresentException e) {
			return null;
		}
	}
	

}
