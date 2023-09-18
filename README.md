# Homebrews - Firebase

Project is intended to run on raspberry pi device as a startup service. Its purpose it to listen for beacons from a [Tilt Hydrometer](https://tilthydrometer.com/) and store that data in a Firebase Realtime database. 

The logic that listens for the beacons was attained from the [node-beacon-scanner project](https://github.com/futomi/node-beacon-scanner). That project contained more logic than what I needed, therefore, I only took the pieces I needed for this project.

Modules used:
* @abandonware/noble
* firebase-admin

To run service automatically on raspberry pi, copy pi.service file to /etc/systemd/system folder on pi. Then run the following:
* sudo systemctl enable tilt.service (registers new service with os boot logic)
* sudo systemctl start tilt.service (manually starts service if not wanting to reboot right away)