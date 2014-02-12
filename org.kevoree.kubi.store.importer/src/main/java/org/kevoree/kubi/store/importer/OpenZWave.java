package org.kevoree.kubi.store.importer;

import org.kevoree.kubi.store.*;
import org.kevoree.kubi.store.impl.DefaultStoreFactory;
import org.kevoree.kubi.store.serializer.JSONModelSerializer;
import org.kevoree.log.Log;
import org.kevoree.modeling.api.ModelSerializer;

import javax.xml.stream.XMLEventReader;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.events.Attribute;
import javax.xml.stream.events.StartElement;
import javax.xml.stream.events.XMLEvent;
import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.Iterator;

/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 11/11/2013
 * Time: 14:56
 * To change this template use File | Settings | File Templates.
 */
public class OpenZWave {


    //Imports the database from Open Z_Wave
    public static void main(String[] args) {

        String baseUrl = "http://open-zwave.googlecode.com/svn/trunk/config";

        StoreFactory factory = new DefaultStoreFactory();
        KubiStore store = factory.createKubiStore();
        Technology zwave = factory.createTechnology();
        zwave.setName("Z-Wave");
        store.addTechnologies(zwave);

        try {

            URL url = new URL(baseUrl + "/manufacturer_specific.xml");
            URLConnection connection = url.openConnection();
            int fileLength = connection.getContentLength();

            if (fileLength == -1) {
                System.out.println("Invalide URL or file.");
                return;
            }
            XMLInputFactory inputFactory = XMLInputFactory.newInstance();
            InputStream input = connection.getInputStream();
            XMLEventReader eventReader = inputFactory.createXMLEventReader(input);


            Manufacturer lastLoadedManufacturer = factory.createManufacturer(); // void manufacturer

            while(eventReader.hasNext()) {
                XMLEvent event = eventReader.nextEvent();
                if(event.isStartElement()) {
                    StartElement startElt = event.asStartElement();
                    if(startElt.getName().getLocalPart().equals("Manufacturer")) {

                        lastLoadedManufacturer = factory.createManufacturer();

                        Iterator<Attribute> attributes = startElt.getAttributes();
                        while(attributes.hasNext()) {
                            Attribute next = attributes.next();
                            if(next.getName().toString().equals("id")) {
                                lastLoadedManufacturer.setId(next.getValue());
                            } else if(next.getName().toString().equals("name")) {
                                lastLoadedManufacturer.setName(next.getValue());
                            }
                        }
                        store.addManufacturers(lastLoadedManufacturer);

                    } else if(startElt.getName().getLocalPart().equals("Product")) {

                        Product product = factory.createProduct();

                        Iterator<Attribute> attributes = startElt.getAttributes();
                        while(attributes.hasNext())
                        {
                            Attribute next = attributes.next();
                            String attrName = next.getName().toString();

                            if(attrName.equals("id")) {
                                product.setId(next.getValue());
                            } else if(attrName.equals("name")) {
                               product.setName(next.getValue());
                            } else if(attrName.equals("type")) {
                                product.setTypeid(next.getValue());
                            } else if(attrName.equals("config")) {
                                Log.warn("Ignored Configuration file:" + next.getValue() + " for product " + product.getName());
                                //config = next.getValue();
                            }
                        }

                        product.setManufacturer(lastLoadedManufacturer);
                        product.setTechnology(zwave);
                        store.addProducts(product);
                    }
                }
            }
        } catch (MalformedURLException e1) {
            e1.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } catch (XMLStreamException e1) {
            e1.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } catch (IOException e1) {
            e1.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }


        //Updates
        addAeonMicroSmartSwitch(store);


        try {
            ModelSerializer serializer = new JSONModelSerializer();
            serializer.serializeToStream(store, new FileOutputStream(new File("" +
                    "org.kevoree.kubi.store.importer/src/main/resources/static/baseStore.json")));
        } catch (FileNotFoundException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } catch (IOException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }


    }

    private static void addAeonMicroSmartSwitch(KubiStore mainStore) {
        StoreFactory factory = new DefaultStoreFactory();
        Product p = factory.createProduct();
        p.setId("0012");
        p.setTypeid("0003");
        p.setManufacturer(mainStore.findManufacturersByID("0086"));
        p.setTechnology(mainStore.findTechnologiesByID("Z-Wave"));
        p.setName("Micro Smart Switch(2nd ed.)");
        mainStore.addProducts(p);


        Product p2 = factory.createProduct();
        p2.setId("1001");
        p2.setTypeid("0301");
        p2.setManufacturer(mainStore.findManufacturersByID("010f"));
        p2.setTechnology(mainStore.findTechnologiesByID("Z-Wave"));
        p2.setName("Roller Shutter 2");
        mainStore.addProducts(p2);
    }

}
