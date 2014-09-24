package org.kevoree.kubi.framework;

import org.kevoree.kubi.store.KubiStore;
import org.kevoree.kubi.store.Manufacturer;
import org.kevoree.kubi.store.Product;
import org.kevoree.kubi.store.factory.StoreTransaction;
import org.kevoree.kubi.store.factory.StoreTransactionManager;
import org.kevoree.kubi.store.model.HttpDataStore;
import org.kevoree.log.Log;

/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 12/11/2013
 * Time: 11:57
 */

public class ProductsStoreManager {

    private StoreTransactionManager stm;
    private HttpDataStore localDataStore;
    private KubiStore store;
    private static ProductsStoreManager INSTANCE;
    private String productStoreAddress = "http://localhost:8082";

    public static ProductsStoreManager getInstance() {
        if(INSTANCE == null) {
            INSTANCE = new ProductsStoreManager();
        }
        return INSTANCE;
    }

    public String getProductStoreAddress() {
        return productStoreAddress;
    }

    public void setProductStoreAddress(String productStoreAddress) {
        this.productStoreAddress = productStoreAddress;
        localDataStore = new HttpDataStore(productStoreAddress + "/datastore");
        stm.close();
        stm = new StoreTransactionManager(localDataStore);
        StoreTransaction trans = stm.createTransaction();
        store = (KubiStore) trans.lookup("/");
        trans.close();
    }

    private ProductsStoreManager() {
        localDataStore = new HttpDataStore(productStoreAddress + "/datastore");
        stm = new StoreTransactionManager(localDataStore);
        StoreTransaction trans = stm.createTransaction();
        store = (KubiStore) trans.lookup("/");
        trans.close();
    }


    public Manufacturer getManufacturerById(String manufacturerId) {
        Log.trace("[START]Find ManufacturerById");
        Manufacturer manufacturer = store.findManufacturersByID(manufacturerId);
        Log.trace("[STOP]Find ManufacturerById");
        return manufacturer;
    }


    public Product getProductById(Manufacturer manufacturer, String productId) {
        Log.trace("[START]Find ProductById");
        for(Product p : store.getProducts()) {
            if(p.getManufacturer() == manufacturer && ("" + p.getTypeid() + p.getId()).equalsIgnoreCase(productId)){
                return p;
            }
        }
        Log.trace("[STOP]Find ProductById");
        return null;
    }



}
