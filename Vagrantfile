VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  
  config.ssh.insert_key = false
  config.ssh.private_key_path = "vagrant"

  config.vm.define "appserver" do |instance|
    instance.vm.box = "ubuntu/precise64"
    instance.vm.synced_folder "applications", "/home/vagrant/applications"
    instance.vm.network "private_network", ip: "192.168.32.10"
    instance.vm.network "forwarded_port", guest: 22, host: 3230
    instance.ssh.port = 3230
    instance.vm.provision :ansible do |ansible|
      ansible.inventory_path = "./inventory"
      ansible.playbook = "provisioning/appserver.yml"
    end
  end
  
  config.vm.define "keyserver" do |instance|
    instance.vm.box = "ubuntu/precise64"
    instance.vm.synced_folder "applications", "/home/vagrant/applications"
    instance.vm.network "private_network", ip: "192.168.32.11"
    instance.vm.network "forwarded_port", guest: 22, host: 3231
    instance.ssh.port = 3231
    instance.vm.provision :ansible do |ansible|
      ansible.inventory_path = "./inventory"
      ansible.playbook = "provisioning/keyserver.yml"
    end
  end
  
end