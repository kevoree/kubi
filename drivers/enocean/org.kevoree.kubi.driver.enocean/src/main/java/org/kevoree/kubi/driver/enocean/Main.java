package org.kevoree.kubi.driver.enocean;

import eu.aleon.aleoncean.rxtx.USB300;

import java.util.concurrent.LinkedBlockingQueue;

/**
 * Created by duke on 13/03/15.
 */
public class Main {

    public static void main(String[] args) {
        USB300 usb300 = new USB300();
        usb300.connect("/dev/tty.usbserial-FTXGRVZF");
        LinkedBlockingQueue readQueue = new LinkedBlockingQueue();
        Thread reader = new Thread(new ESP3Reader(usb300, readQueue));
        reader.start();

    }

}
