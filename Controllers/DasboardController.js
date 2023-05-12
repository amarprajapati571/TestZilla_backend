import { MongoClient } from 'mongodb';
import os from 'os';
const DATABASE_URL = process.env.DATABASE_URL
class DashboardController{
  static SystemDetails = async(req,res)=>{
            MongoClient.connect(DATABASE_URL, function(err, client) {
              console.log(err)
              if (err) throw err;
          
              const db = client.db('tyarizilla');
              db.command({ dbStats: 1 }, function(err, result) {
                if (err) throw err;
                console.log(err)
          
                const storageSizeInBytes = result.storageSize;
                const fsTotalSizeInBytes = result.fsTotalSize;
                const storageUsage = (storageSizeInBytes / fsTotalSizeInBytes) * 100;
                const storageSizeInGB = storageSizeInBytes / Math.pow(1024, 3);
                const fsTotalSizeInGB = fsTotalSizeInBytes / Math.pow(1024, 3);
          
                const totalStorageInBytes = os.totalmem();
                const freeStorageInBytes = os.freemem();
                const usedStorageInBytes = totalStorageInBytes - freeStorageInBytes;
                const storageUsagePercentage = (usedStorageInBytes / totalStorageInBytes) * 100;
                const totalStorageInGB = totalStorageInBytes / Math.pow(1024, 3);
                const usedStorageInGB = usedStorageInBytes / Math.pow(1024, 3);
                const freeStorageInGB = freeStorageInBytes / Math.pow(1024, 3);
          
                const cpuCount = os.cpus().length;
                const cpuUsage = (os.loadavg()[0] / cpuCount) * 100;
          
                const response = {
                  db: {
                    storageSize: storageSizeInGB.toFixed(2) + ' GB',
                    storageUsage: storageUsage.toFixed(2) + '%',
                    fsTotalSize: fsTotalSizeInGB.toFixed(2) + ' GB'
                  },
                  server: {
                    totalStorage: totalStorageInGB.toFixed(2) + ' GB',
                    usedStorage: usedStorageInGB.toFixed(2) + ' GB',
                    freeStorage: freeStorageInGB.toFixed(2) + ' GB',
                    storageUsage: storageUsagePercentage.toFixed(2) + '%',
                    cpuUsage: cpuUsage.toFixed(2) + '%'
                  }
                };
                console.log(response)
                res.json(response);
                client.close();
              });
            });
    }
}

export default DashboardController;


