#!/bin/bash
# Autorise uniquement les registres de packages

# PyPI
iptables -A OUTPUT -d pypi.org -j ACCEPT
iptables -A OUTPUT -d files.pythonhosted.org -j ACCEPT

# npm
iptables -A OUTPUT -d registry.npmjs.org -j ACCEPT

# DNS
iptables -A OUTPUT -p udp --dport 53 -j ACCEPT
iptables -A OUTPUT -p tcp --dport 53 -j ACCEPT

# Loopback pour le server
iptables -A OUTPUT -o lo -j ACCEPT

# pr la conenxion deja en place
iptables -A OUTPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Bloque tout le reste
iptables -A OUTPUT -j DROP